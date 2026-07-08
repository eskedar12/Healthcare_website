const AdminStats = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans text-xs font-medium text-text-muted uppercase tracking-wider">
            {title}
          </p>
          <p className="font-serif text-2xl text-text-dark mt-1">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="text-lg" />
        </div>
      </div>
      {change && (
        <p className="font-sans text-xs text-green-600 mt-2 flex items-center gap-1">
          <span>↑</span> {change} from last month
        </p>
      )}
    </div>
  )
}

export default AdminStats