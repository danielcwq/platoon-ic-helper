import { useState } from 'react';
import { useForm } from 'react-hook-form';

const StatusForm = ({ addStatus }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    addStatus(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="id" className="sr-only">
          4D
        </label>
        <input
          type="number"
          name="id"
          id="id"
          autoComplete="off"
          placeholder="ID"
          {...register('id', { required: true })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.id && <p className="text-red-500">4D is required.</p>}
      </div>

      <div>
        <label htmlFor="condition" className="sr-only">
          Condition
        </label>
        <select
          name="condition"
          id="condition"
          {...register('condition', { required: true })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a condition</option>
          <option value="UFD">UFD</option>
          <option value="RMJ">RMJ</option>
          <option value="LD">LD</option>
          <option value="Report Sick">Report Sick</option>
        </select>
        {errors.condition && <p className="text-red-500">Condition is required.</p>}
      </div>

      <div>
        <label htmlFor="startDate" className="sr-only">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          autoComplete="off"
          {...register('startDate', { required: true })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.startDate && <p className="text-red-500">Start Date is required.</p>}
      </div>

      <div>
        <label htmlFor="endDate" className="sr-only">
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          autoComplete="off"
          {...register('endDate', { required: true })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {errors.endDate && <p className="text-red-500">End Date is required.</p>}
      </div>

      <div>
        <label htmlFor="reason" className="sr-only">
          Reason
        </label>
        <input
          type="text"
          name="reason"
          id="reason"
          autoComplete="off"
          placeholder="Reason"
          {...register('reason')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Add Status
      </button>
    </form>
  );
};

export default StatusForm;
