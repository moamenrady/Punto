import React from "react";
import TicketCard from "./TicketCard";

const TicketList = ({ tickets, onTicketClick }) => {
  return (
    <div className="ticket-list">
      {tickets?.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          onClick={() => onTicketClick(ticket)}
        />
      ))}
    </div>
  );
};

export default TicketList;
