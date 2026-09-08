import SideBar from "./components/SideBar";
export default function Rootlayout({
  children
}:
  {
    children: React.ReactNode
  }
) {
  return (
    <html lang="en">
      <body>
        <SideBar />
        {children}
      </body>
    </html>
  );
}