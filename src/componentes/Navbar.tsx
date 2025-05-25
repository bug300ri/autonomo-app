import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#f3f4f6',
      borderBottom: '1px solid #ccc'
    }}>
      <Link href="/">🏠 Inicio</Link>
      <Link href="/autonomo">🧮 Calculadora</Link>
      <Link href="/invoices">📄 Facturas</Link>
      <Link href="/expenses">💸 Gastos</Link>
    </nav>
  );
}
