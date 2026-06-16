"use client";

import React, { useState, useEffect } from "react";
import { Booking, BookingFormData, BookingStatus } from "@/lib/booking-types";
import { INITIAL_BOOKINGS } from "@/lib/mock-bookings";
import { BookingToolbar } from "@/features/bookings/components/BookingToolbar";
import { BookingTable } from "@/features/bookings/components/BookingTable";
import { BookingModal } from "@/features/bookings/components/BookingModal";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const handleNewBooking = () => {
    setEditingBooking(null);
    setModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBooking(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("cafecore_bookings");
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse bookings", err);
        setBookings(INITIAL_BOOKINGS);
      }
    } else {
      setBookings(INITIAL_BOOKINGS);
    }
  }, []);

  const saveBookings = (newBookings: any[]) => {
    setBookings(newBookings);
    localStorage.setItem("cafecore_bookings", JSON.stringify(newBookings));
  };

  const handleSaveBooking = (data: BookingFormData) => {
    let newBookings;
    if (data.id) {
      // Edit existing
      newBookings = bookings.map((b) => (b.id === data.id ? { ...b, ...data, id: b.id } : b));
    } else {
      // Create new
      newBookings = [
        ...bookings,
        {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
        },
      ];
    }
    saveBookings(newBookings);
  };

  const handleStatusChange = (id: string, status: BookingStatus) => {
    const newBookings = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    saveBookings(newBookings);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      const newBookings = bookings.filter((b) => b.id !== id);
      saveBookings(newBookings);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto font-sans">
      <BookingToolbar onNewBooking={handleNewBooking} />

      <BookingTable
        bookings={bookings}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onEdit={handleEditBooking}
      />

      <BookingModal
        isOpen={modalOpen}
        existingBookings={bookings}
        onClose={handleCloseModal}
        onSave={handleSaveBooking}
        booking={editingBooking}
      />
    </div>
  );
}
