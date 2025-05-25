import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Factura {
  cliente: string;
  empresa: string;
  cif: string;
  pais: string;
  direccion: string;
  importe: number;
  totalIVA: number;
  totalIRPF: number;
  total: number;
  descripcion: string;
  fecha: string;
  iva: number;
  irpf: number;
}

interface Gasto {
  concepto: string;
  montoGasto: number;
  fecha: string;
}

interface ArchivoGuardado {
  name: string;
  url: string;
}

export default function AutonomoApp() {
  const [facturas, setFacturas] = useState<Factura[]>(() => JSON.parse(localStorage.getItem("facturas") || "[]"));
  const [gastos, setGastos] = useState<Gasto[]>(() => JSON.parse(localStorage.getItem("gastos") || "[]"));
  const [cliente, setCliente] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [cif, setCif] = useState("");
  const [pais, setPais] = useState("");
  const [direccion, setDireccion] = useState("");
  const [importe, setImporte] = useState(0);
  const [iva, setIva] = useState(21);
  const [irpf, setIrpf] = useState(15);
  const [descripcion, setDescripcion] = useState("");
  const [concepto, setConcepto] = useState("");
  const [montoGasto, setMontoGasto] = useState(0);
  const [fecha, setFecha] = useState("");
  const [archivos, setArchivos] = useState<ArchivoGuardado[]>(() => {
    const guardados = localStorage.getItem("archivos");
    return guardados ? JSON.parse(guardados) : [];
  });

  const manejarCargaArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const nuevosArchivos = [...archivos, ...Array.from(files).map(file => ({ name: file.name, url: URL.createObjectURL(file) }))];
      setArchivos(nuevosArchivos);
      localStorage.setItem("archivos", JSON.stringify(nuevosArchivos));
    }
  };

  const eliminarArchivo = (index: number) => {
    const nuevos = [...archivos];
    nuevos.splice(index, 1);
    setArchivos(nuevos);
    localStorage.setItem("archivos", JSON.stringify(nuevos));
  };

  useEffect(() => {
    localStorage.setItem("facturas", JSON.stringify(facturas));
  }, [facturas]);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().slice(5, 10); // MM-DD

    const fechasNotificar = [
      { fecha: "01-20", mensaje: "📢 Recuerda presentar el Modelo 130 y 303 del 4T" },
      { fecha: "04-20", mensaje: "📢 Recuerda presentar el Modelo 130 y 303 del 1T" },
      { fecha: "07-20", mensaje: "📢 Recuerda presentar el Modelo 130 y 303 del 2T" },
      { fecha: "10-20", mensaje: "📢 Recuerda presentar el Modelo 130 y 303 del 3T" },
      { fecha: "06-30", mensaje: "📢 Último día para presentar la declaración de la renta" }
    ];

    const hoyNotificacion = fechasNotificar.find(f => f.fecha === fechaActual);
    if (hoyNotificacion && Notification.permission === "granted") {
      new Notification(hoyNotificacion.mensaje);
    } else if (hoyNotificacion && Notification.permission !== "denied") {
      Notification.requestPermission().then(permiso => {
        if (permiso === "granted") {
          new Notification(hoyNotificacion.mensaje);
        }
      });
    }
  }, []);

  const agregarFactura = () => {
    if (!cliente || !empresa || !cif || importe <= 0 || !fecha) return;
    const totalIVA = importe * (iva / 100);
    const totalIRPF = importe * (irpf / 100);
    const total = importe + totalIVA - totalIRPF;
    setFacturas([...facturas, { cliente, empresa, cif, pais, direccion, importe, totalIVA, totalIRPF, total, descripcion, fecha, iva, irpf }]);
    setCliente(""); setEmpresa(""); setCif(""); setPais(""); setDireccion(""); setImporte(0); setDescripcion(""); setFecha(""); setIva(21); setIrpf(15);
  };

  const eliminarFactura = (index: number) => {
    const nuevas = [...facturas];
    nuevas.splice(index, 1);
    setFacturas(nuevas);
  };

  const agregarGasto = () => {
    if (!concepto || montoGasto <= 0 || !fecha) return;
    setGastos([...gastos, { concepto, montoGasto, fecha }]);
    setConcepto(""); setMontoGasto(0); setFecha("");
  };

  const eliminarGasto = (index: number) => {
    const nuevos = [...gastos];
    nuevos.splice(index, 1);
    setGastos(nuevos);
  };

  const descargarFacturasPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
      head: [["Cliente", "Empresa", "Total (€)", "IVA", "IRPF", "Descripción", "Fecha"]],
      body: facturas.map((f) => [f.cliente, f.empresa, f.total.toFixed(2), f.totalIVA.toFixed(2), f.totalIRPF.toFixed(2), f.descripcion, f.fecha]),
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 60 },
        6: { cellWidth: 40 },
      }
    });
    doc.save("facturas.pdf");
  };

  const descargarGastosPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    autoTable(doc, {
      head: [["Concepto", "Monto (€)", "Fecha"]],
      body: gastos.map((g) => [g.concepto, g.montoGasto.toFixed(2), g.fecha]),
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 }
      }
    });
    doc.save("gastos.pdf");
  };

  const totalFacturado = facturas.reduce((s, f) => s + f.total, 0);
  const totalGastos = gastos.reduce((s, g) => s + g.montoGasto, 0);
  const balance = totalFacturado - totalGastos;

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">📦 Mi autonomía</h1>
      <div className="container">
        <section className="bg-gray-800 text-white p-4 rounded-xl shadow-md">
  <h2 className="text-xl font-bold mb-2">🗂️ Registros</h2>
  <p className="mb-2">📄 Modelo 130 y documentos oficiales</p>
  <ul className="list-disc list-inside text-sm text-gray-300 mb-4">
    <li>🧾 Modelo 130: trimestral (Abril, Julio, Octubre, Enero)</li>
    <li>📑 Modelo 303 (IVA): trimestral</li>
    <li>📊 Modelo 390: resumen anual IVA en enero</li>
    <li>💰 Renta (Modelo 100): hasta el 30 de junio</li>
  </ul>
  <a
    href="https://www.agenciatributaria.es/AEAT.internet/Inicio/_Segmentos_/Empresarios_y_profesionales/_Empresarios_individuales_y_profesionales/Modelos_tributarios/Modelo_130"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 underline text-sm"
  >
    📘 Ver instrucciones oficiales del Modelo 130
  </a>
</section>

        <section>
          <h2 className="text-xl font-bold mb-2">📁 Facturas</h2>
          <input className="w-[380px]" placeholder="Cliente" value={cliente} onChange={e => setCliente(e.target.value)} />
          <input className="w-[380px]" placeholder="Empresa" value={empresa} onChange={e => setEmpresa(e.target.value)} />
          <input className="w-[380px]" placeholder="CIF" value={cif} onChange={e => setCif(e.target.value)} />
          <input className="w-[380px]" placeholder="País" value={pais} onChange={e => setPais(e.target.value)} />
          <input className="w-[380px]" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
          <input className="w-[380px]" type="number" placeholder="Importe" value={importe} onChange={e => setImporte(Number(e.target.value))} />
          <input className="w-[380px]" type="number" placeholder="IVA (%)" value={iva} onChange={e => setIva(Number(e.target.value))} />
          <input className="w-[380px]" type="number" placeholder="IRPF (%)" value={irpf} onChange={e => setIrpf(Number(e.target.value))} />
          <input className="w-[380px]" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <input className="w-[380px]" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          <div className="space-x-2">
            <button onClick={agregarFactura}>Crear factura</button>
            <button onClick={descargarFacturasPDF}>Descargar PDF</button>
          </div>
          {facturas.map((f, i) => (
            <div key={i}>
              {f.cliente} - {f.total.toFixed(2)} € (IVA: {f.totalIVA.toFixed(2)} / IRPF: {f.totalIRPF.toFixed(2)}) - Fecha: {f.fecha}
              <button onClick={() => eliminarFactura(i)}>❌</button>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">💸 Gastos</h2>
          <input className="w-[380px]" placeholder="Concepto" value={concepto} onChange={e => setConcepto(e.target.value)} />
          <input className="w-[380px]" type="number" placeholder="Monto" value={montoGasto} onChange={e => setMontoGasto(Number(e.target.value))} />
          <input className="w-[380px]" type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
          <div className="space-x-2">
            <button onClick={agregarGasto}>Ahorrar gasto</button>
            <button onClick={descargarGastosPDF}>Descargar PDF</button>
          </div>
          {gastos.map((g, i) => (
            <div key={i}>
              {g.concepto} - {g.montoGasto.toFixed(2)} € - Fecha: {g.fecha}
              <button onClick={() => eliminarGasto(i)}>❌</button>
            </div>
          ))}
        </section>
      </div>

      {/* Resumen */}
      <section className="mt-6 text-right">
        <h2 className="text-xl font-bold mb-2">📊 Resumen</h2>
        <p>Total facturado: {totalFacturado.toFixed(2)} €</p>
        <p>Gastos totales: {totalGastos.toFixed(2)} €</p>
        <p>Saldo: {balance.toFixed(2)} €</p>
      </section>

      {/* Subida de documentos */}
      <section className="mt-10 bg-gray-800 text-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">📁 Subida de documentos</h2>
        <input type="file" onChange={manejarCargaArchivo} multiple className="mb-4" />
        {archivos.length > 0 && (
          <ul className="space-y-2">
            {archivos.map((archivo, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span>{archivo.name}</span>
                <div className="flex gap-2">
                  <a href={archivo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    Ver
                  </a>
                  <button onClick={() => eliminarArchivo(index)} className="text-red-400 font-bold">
                    ✖
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
