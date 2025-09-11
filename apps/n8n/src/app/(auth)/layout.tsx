import React from "react";

function layout({ children }: { children: React.ReactNode }) {
	return <div className="min-h-screen w-screen bg-slate-900">{children}</div>;
}

export default layout;
