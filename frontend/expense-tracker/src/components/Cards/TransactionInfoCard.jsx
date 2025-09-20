import React from 'react'
import { LuTrash2, LuTrendingDown, LuTrendingUp, LuUtensils } from 'react-icons/lu'

const TransactionInfoCard = ({
  title,
  icon,
  date,
  amount,
  type,
  hideDeletebtn,
  onDelete
}) => {
  
  const normalizedType = type?.toLowerCase();
  const getAmountStyle = () =>
    normalizedType === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className='group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60'>

      {/* Icon */}
      <div className='w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full'>
        {icon ? (
          <img src={icon} alt={title} className='w-6 h-6' />
        ) : (
          <LuUtensils />
        )}
      </div>

      {/* Details */}
      <div className='flex-1'>
        <p className='font-medium text-sm text-gray-700'>{title}</p>
        <p className='text-xs text-gray-400 mt-0.5'>{date}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!hideDeletebtn && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
          >
            <LuTrash2 size={18} />
          </button>
        )}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyle()}`}>
          <h6 className='text-xs font-medium'>
            {normalizedType === "income" ? '+' : '-'}${amount}
          </h6>
          {normalizedType === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
        </div>
      </div>
    </div>
  )
}

export default TransactionInfoCard
