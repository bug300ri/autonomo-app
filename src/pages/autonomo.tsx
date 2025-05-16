// ✅ AUTONOMO APP COMPLETA CON RECORDATORIOS + LOCALSTORAGE

import { useEffect, useState } from "react";

export default function AutonomoApp() {
  const [facturas, setFacturas] = useState(() => JSON.parse(localStorage.getItem("facturas") || "[]"));
  const [gastos, setGastos] = useState(() => JSON.parse(localStorage.getItem("gastos") || "[]"));
  const [recordatorios, setRecordatorios] = useState([]);

  const [cliente, setCliente] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cif, setCif] = useState("");
  const [pais, setPais] = useState("");
  const [direccion, setDireccion] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [descripcion, setDescripcion] = useState("");

  const [concepto, setConcepto] = useState("");
  const [importe, setImporte] = useState(0);

  useEffect(() => {
    localStorage.setItem("facturas", JSON.stringify(facturas));
  }, [facturas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    const today = new Date();
    const deadlines = [
      { date: new Date(today.getFullYear(), 3, 15), message: "Modelo 130" },
      { date: new Date(today.getFullYear(), 5, 30), message: "Declaración renta anual" },
      { date: new Date(today.getFullYear(), 6, 1), message: "Pago cuota autónomos" },
      { date: new Date(today.getFullYear(), 6, 10), message: "Cobro pendiente Juan García" }
    ];
    const alerts = deadlines.map(d => {
      const diff = (d.date - today) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 3 ? `🔔 ${d.message}` : d.message;
    });
    setRecordatorios(alerts);
  }, []);

  const downloadFactura = (factura) => {
    const content = `Factura\nCliente: ${factura.cliente}\nEmpresa: ${factura.empresa}\nCIF: ${factura.cif}\nPaís: ${factura.pais ?? ''}\nDirección: ${factura.direccion ?? ''}\nCantidad: ${factura.cantidad} €\nDescripción: ${factura.descripcion}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `factura-${factura.cliente}.txt`;
    link.click();
  }

  return (
    <div>
      <h1>Mi Autonomía</h1>

      {/* ✅ RECORDATORIOS */}
      <h2>⏰ Recordatorios</h2>
      <ul>{recordatorios.map((msg, idx) => <li key={idx}>{msg}</li>)}</ul>

      {/* ✅ FACTURAS */}
      <h2>🧾 Facturas</h2>
      <input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Cliente" />
      <input value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Empresa" />
      <input value={cif} onChange={e => setCif(e.target.value)} placeholder="CIF" />
      <input value={pais} onChange={e => setPais(e.target.value)} placeholder="País (opcional)" />
      <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Dirección (opcional)" />
      <input value={cantidad} type="number" onChange={e => setCantidad(parseFloat(e.target.value) || 0)} placeholder="Cantidad (€)" />
      <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" />
      <button onClick={() => {
        if(cliente && empresa && cif && cantidad > 0 && descripcion){
          setFacturas([...facturas, { cliente, empresa, cif, pais, direccion, cantidad, descripcion }]);
          setCliente(""); setEmpresa(""); setCif(""); setPais(""); setDireccion(""); setCantidad(0); setDescripcion("");
        }
      }}>✅ Crear Factura</button>
      {facturas.map((f, i) => (
        <div key={i}>
          <p>{f.cliente} | {f.empresa} | {f.cif} | {f.pais} | {f.direccion} | {f.cantidad}€ | {f.descripcion}</p>
          <button onClick={() => downloadFactura(f)}>💾 Descargar</button>
          <button onClick={() => setFacturas(facturas.filter((_, index) => index !== i))}>🗑️ Borrar</button>
        </div>
      ))}

      {/* ✅ GASTOS */}
      <h2>💸 Gastos</h2>
      <input value={concepto} onChange={e => setConcepto(e.target.value)} placeholder="Concepto" />
      <input value={importe} type="number" onChange={e => setImporte(parseFloat(e.target.value) || 0)} placeholder="Importe (€)" />
      <button onClick={() => {
        if(concepto && importe > 0){
          setGastos([...gastos, { concepto, importe }]);
          setConcepto(""); setImporte(0);
        }
      }}>💾 Guardar Gasto</button>
      {gastos.map((g, i) => (
        <div key={i}>
          <p>{g.concepto} - {g.importe} €</p>
          <button onClick={() => setGastos(gastos.filter((_, index) => index !== i))}>🗑️ Borrar</button>
        </div>
      ))}

      {/* ✅ RESUMEN */}
      <h2>📊 Resumen</h2>
      <p>Total facturado: {facturas.reduce((sum, f) => sum + f.cantidad, 0)} €</p>
      <p>Total gastos: {gastos.reduce((sum, g) => sum + g.importe, 0)} €</p>
      <p>Balance: {facturas.reduce((sum, f) => sum + f.cantidad, 0) - gastos.reduce((sum, g) => sum + g.importe, 0)} €</p>
    </div>
  );
}
