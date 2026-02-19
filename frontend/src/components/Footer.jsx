const Footer = () => (
    <footer className="border-t border-zinc-900 bg-black py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[11px] text-zinc-500 tracking-wider uppercase">
                &copy; 2026 Echo-Note Intelligence
            </div>
            <div className="flex gap-6">
                {['Status', 'Privacy', 'API'].map((item) => (
                    <button key={item} className="text-[11px] text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-widest">
                        {item}
                    </button>
                ))}
            </div>
        </div>
    </footer>
);

export default Footer;