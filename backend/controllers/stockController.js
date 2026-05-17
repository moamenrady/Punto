const Stock = require("../models/stockModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const stream = require("stream");
const csv = require("csv-parser");
const Table = require("../models/tableModel"); // اتأكد إن المسار صح
const AppError = require("../utils/appError");

// Standard CRUD
exports.getAllStock = factory.getAll(Stock);
exports.getOneStock = factory.getOne(Stock);
exports.updateStock = factory.updateOne(Stock);
exports.deleteStock = factory.deleteOne(Stock);

// ─── 1. فانكشن الإضافة المانيوال الشاملة (createStock) ───
exports.createStock = catchAsync(async (req, res, next) => {
  // حقن الـ company_id لضمان الأمان وفصل الشركات
  if (req.user?.company_id) {
    if (Array.isArray(req.body)) {
      req.body.forEach((item) => {
        item.company_id = req.user.company_id;
      });
    } else {
      req.body.company_id = req.user.company_id;
    }
  }

  let doc;

  // تشخيص الـ Body: هل هو Array (مجموعة) ولا Object (منتج واحد)؟
  if (Array.isArray(req.body)) {
    // ─── الحالة الأولى: لو جاي كذا منتج مع بعض مانيوال (Array) ───
    const bulkOperations = req.body.map((item) => {
      // بنفصل الـ quantity والـ sku عشان نمنع الـ conflict ونحمي البيانات
      const { quantity, sku, ...restOfItem } = item;
      const qtyNumber = Number(quantity) || 0;

      return {
        updateOne: {
          filter: { sku: sku, company_id: req.user.company_id },
          update: {
            $inc: { quantity: qtyNumber }, // يزود الكمية بس لو المنتج موجود
            $setOnInsert: restOfItem, // يكتب باقي الداتا (الاسم والسعر) بس لو جديد
          },
          upsert: true,
        },
      };
    });

    // بنفذهم كلهم مرة واحدة بخبطة سريعة
    doc = await Stock.bulkWrite(bulkOperations);
  } else {
    // ─── الحالة الثانية: لو جاي منتج واحد مانيوال (Object) ───
    const { quantity, sku, ...restOfBody } = req.body;
    const qtyNumber = Number(quantity) || 0;

    doc = await Stock.findOneAndUpdate(
      { sku: sku, company_id: req.user.company_id },
      {
        $inc: { quantity: qtyNumber }, // الجمع في السليم
        $setOnInsert: restOfBody, // حماية الاسم والسعر لو موجود
      },
      {
        new: true,
        upsert: true,
        runValidators: true, // تشغيل حارس أمن Mongoose للمانيوال
      },
    );
  }

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

// ─── 2. فانكشن رفع وقراءة الملف الشاملة (uploadCSV) ───
exports.uploadCSV = catchAsync(async (req, res, next) => {
  // نتأكد إن فيه ملف اتبعت
  if (!req.file) {
    return next(new AppError("Please upload a CSV file", 400));
  }

  const results = [];
  const allowedCurrencies = ["SAR", "USD", "EUR", "GBP", "AED"]; // لستة العملات المسموحة للـ Validation

  // نقرا الملف من الذاكرة المؤقتة (الرامات)
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csv())
    .on("data", (data) => {
      // بنحط الـ company_id لكل منتج جاي من الـ CSV
      if (req.user?.company_id) {
        data.company_id = req.user.company_id;
      }
      results.push(data);
    })
    .on("end", async () => {
      try {
        // ── الـ Validation اليدوي الصارم لحماية الداتابيز من عك الـ CSV ──
        for (const item of results) {
          // أ- تشيك الحقول المطلوبة
          if (!item.name || !item.sku || !item.quantity || !item.cost) {
            return next(
              new AppError(
                "CSV Data Error: Missing required fields (name, sku, quantity, or cost) in one of the rows.",
                400,
              ),
            );
          }
          // ب- تشيك مطابقة العملة للـ enum
          if (
            item.currency &&
            !allowedCurrencies.includes(item.currency.toUpperCase())
          ) {
            return next(
              new AppError(
                `CSV Data Error: Currency '${item.currency}' is not supported.`,
                400,
              ),
            );
          }
        }

        // 1. حفظ نسخة أرشيف في جدول الـ Tables (شغل صاحبك النظيف)
        await Table.create({
          filename: req.file.originalname,
          company_id: req.user.company_id,
          user_id: req.user._id || req.user.id,
          data: results,
        });

        // 2. عمليات الـ Bulk الذكية والمحمية بـ $setOnInsert
        const bulkOperations = results.map((item) => {
          const { quantity, sku, ...restOfItem } = item;
          const qtyNumber = Number(quantity) || 0;

          // توحيد حالة أحرف العملة عشان متعملش إيرور بسبب كابيتال وسمول
          if (restOfItem.currency) {
            restOfItem.currency = restOfItem.currency.toUpperCase();
          }

          return {
            updateOne: {
              filter: { sku: sku, company_id: req.user.company_id },
              update: {
                $inc: { quantity: qtyNumber }, // يزود الكمية التراكمية
                $setOnInsert: restOfItem, // يكتب باقي الداتا لو الصنف بيتسجل لأول مرة بس
              },
              upsert: true,
            },
          };
        });

        const bulkResult = await Stock.bulkWrite(bulkOperations);

        // 3. الرد بنجاح العملية مع تفاصيل الـ الـ Bulk
        res.status(201).json({
          status: "success",
          message: "CSV processed with high data integrity (Inserted/Updated)",
          details: {
            inserted: bulkResult.upsertedCount,
            updated: bulkResult.modifiedCount,
          },
        });
      } catch (error) {
        return next(
          new AppError("Error processing CSV data: " + error.message, 500),
        );
      }
    });
});

// exports.createStock = catchAsync(async (req, res, next) => {
//   // 1. حقن الـ company_id لضمان الأمان وفصل الشركات
//   if (req.user?.company_id) {
//     if (Array.isArray(req.body)) {
//       req.body.forEach((item) => {
//         item.company_id = req.user.company_id;
//       });
//     } else {
//       req.body.company_id = req.user.company_id;
//     }
//   }

//   let doc;

//   // 2. تشخيص الـ Body: هل هو Array (مجموعة) ولا Object (منتج واحد)؟
//   if (Array.isArray(req.body)) {
//     // ─── الحالة الأولى: لو جاي كذا منتج مع بعض (Array) ───
//     const bulkOperations = req.body.map((item) => {
//       const { quantity, ...restOfItem } = item;
//       const qtyNumber = Number(quantity) || 0;

//       return {
//         updateOne: {
//           filter: { sku: item.sku, company_id: req.user.company_id },
//           update: {
//             $inc: { quantity: qtyNumber },
//             $set: restOfItem,
//           },
//           upsert: true,
//         },
//       };
//     });

//     // بنفذهم كلهم مرة واحدة
//     doc = await Stock.bulkWrite(bulkOperations);
//   } else {
//     // ─── الحالة الثانية: لو جاي منتج واحد مانيوال (Object) ───
//     // بنفصل الـ quantity والـ sku عن بقية الحقول (restOfBody)
//     const { quantity, sku, ...restOfBody } = req.body;
//     const qtyNumber = Number(quantity) || 0;

//     doc = await Stock.findOneAndUpdate(
//       { sku: sku, company_id: req.user.company_id },
//       {
//         $inc: { quantity: qtyNumber }, // الجمع بيتم هنا لوحده في السليم
//         $set: restOfBody, // بقية البيانات (الاسم، السعر...) بتتحدث هنا من غير الـ quantity
//       },
//       {
//         new: true,
//         upsert: true,
//         runValidators: true,
//       },
//     );
//   }

//   // 3. الرد بنجاح العملية في الحالتين
//   res.status(201).json({
//     status: "success",
//     data: {
//       data: doc,
//     },
//   });
// });

// exports.uploadCSV = catchAsync(async (req, res, next) => {
//   // 1. نتأكد إن فيه ملف اتبعت
//   if (!req.file) {
//     return next(new AppError("Please upload a CSV file", 400));
//   }

//   const results = [];

//   // 2. نقرا الملف من الذاكرة المؤقتة (الرامات)
//   const bufferStream = new stream.PassThrough();
//   bufferStream.end(req.file.buffer);

//   bufferStream
//     .pipe(csv())
//     .on("data", (data) => {
//       // بنحط الـ company_id لكل منتج عشان يتسجل للشركة الصح
//       if (req.user?.company_id) {
//         data.company_id = req.user.company_id;
//       }
//       results.push(data);
//     })
//     .on("end", async () => {
//       try {
//         // 1. حفظ نسخة أرشيف في جدول الـ Tables
//         await Table.create({
//           filename: req.file.originalname,
//           company_id: req.user.company_id,
//           user_id: req.user._id || req.user.id,
//           data: results,
//         });

//         // 2. السحر الجديد (Upsert): بنلف على كل منتج جاي من الملف
//         // السحر الجديد: نجمع الكمية ونحدث بقية البيانات
//         const bulkOperations = results.map((item) => {
//           // 1. بنفصل الكمية عن بقية الحقول عشان نجمعها لوحدها
//           const { quantity, ...restOfItem } = item;

//           // نحول الكمية لرقم عشان الداتابيز تعرف تجمع (لأنها بتيجي من الـ CSV كـ نص/String)
//           const qtyNumber = Number(quantity) || 0;

//           return {
//             updateOne: {
//               filter: { sku: item.sku, company_id: req.user.company_id },
//               update: {
//                 // $inc بتجمع الكمية الجديدة على الكمية القديمة اللي في المخزن
//                 $inc: { quantity: qtyNumber },
//                 // $set بتحدث بقية البيانات (الاسم، السعر، الفيندور) عادي لو اتغيروا
//                 $set: restOfItem,
//               },
//               upsert: true, // لو المنتج مش موجود أصلاً، هيكارته من الصفر بالكمية دي
//             },
//           };
//         });

//         // بنفذ العمليات دي كلها في الداتابيز بخبطة واحدة سريعة جداً
//         const bulkResult = await Stock.bulkWrite(bulkOperations);

//         // 3. الرد بنجاح العملية
//         res.status(201).json({
//           status: "success",
//           message: "CSV processed successfully (Inserted/Updated)",
//           details: {
//             inserted: bulkResult.upsertedCount,
//             updated: bulkResult.modifiedCount,
//           },
//         });
//       } catch (error) {
//         return next(
//           new AppError("Error processing CSV data: " + error.message, 500),
//         );
//       }
//     });
// });
