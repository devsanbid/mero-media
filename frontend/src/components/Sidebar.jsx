import Navigation from './Navigation';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-sm overflow-y-auto sidebar">
      <div className="p-4">
        <Navigation />
      </div>
    </aside>
  );
};

export default Sidebar;