import React, { useEffect, useState, Fragment } from 'react';
import { usePassengerManager } from '@mishwari/features-passengers/core';
import { PassengerList, PassengerForm, ConfirmDialog } from '@mishwari/ui-web';
import { Passenger } from '@mishwari/types';
import { Dialog, Transition } from '@headlessui/react';
import MainLayout from '@/layouts/MainLayout';
import useAuth from '@/hooks/useAuth';

export default function PassengersPage() {
  const { isAuthenticated } = useAuth();
  const {
    passengers,
    loading,
    error,
    fetchPassengers,
    addPassenger,
    updatePassenger,
    deletePassenger,
  } = usePassengerManager();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passengerToDelete, setPassengerToDelete] = useState<Passenger | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPassengers();
    }
  }, [isAuthenticated]);

  const handleAdd = () => {
    setEditingPassenger(null);
    setIsModalOpen(true);
  };

  const handleEdit = (passenger: Passenger) => {
    setEditingPassenger(passenger);
    setIsModalOpen(true);
  };

  const handleDelete = (passenger: Passenger) => {
    setPassengerToDelete(passenger);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (passengerToDelete?.id) {
      try {
        await deletePassenger(passengerToDelete.id);
        setDeleteConfirmOpen(false);
        setPassengerToDelete(null);
      } catch (err) {
        alert('فشل حذف الراكب');
      }
    }
  };

  const handleSubmit = async (data: Omit<Passenger, 'id'>) => {
    try {
      if (editingPassenger?.id) {
        await updatePassenger(editingPassenger.id, data);
      } else {
        await addPassenger(data);
      }
      setIsModalOpen(false);
      setEditingPassenger(null);
    } catch (err: any) {
      alert(err.message || 'فشل حفظ الراكب');
    }
  };

  return (
    <MainLayout title="إدارة الركاب">
      <div className="max-w-4xl mx-auto w-full px-4 py-6">
        <section className="bg-white shadow-lg rounded-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {loading && !passengers.length ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <PassengerList
              passengers={passengers}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showCheckbox={false}
              title="قائمة الركاب"
              emptyMessage="لا يوجد ركاب محفوظين"
            />
          )}
        </section>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-xl font-bold mb-6 text-gray-900">
                    {editingPassenger ? 'تعديل معلومات الراكب' : 'إضافة راكب جديد'}
                  </Dialog.Title>
                  <PassengerForm
                    passenger={editingPassenger}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    submitLabel={editingPassenger ? 'تحديث' : 'إضافة'}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="حذف راكب"
        description="هل أنت متأكد من حذف هذا الراكب؟"
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </MainLayout>
  );
}
