const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let visitas = [];

// Registrar una visita
app.post("/api/visit", (req, res) => {

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress ||
        "Desconocida";

    const navegador =
        req.headers["user-agent"] ||
        "Desconocido";

    const pagina =
        req.body.pagina ||
        "/";

    const visita = {
        ip: ip,
        fecha: new Date().toISOString(),
        navegador: navegador,
        pagina: pagina
    };

    visitas.push(visita);

    console.log("🐶 Nueva visita:");
    console.log(visita);

    res.json({
        ok: true
    });
});


// Ver visitas
app.get("/api/visitas", (req, res) => {
    res.json(visitas);
});


// Comprobar servidor
app.get("/api/estado", (req, res) => {
    res.json({
        mensaje: "🐶 Servidor funcionando correctamente"
    });
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`🐶 Servidor funcionando en el puerto ${PORT}`);
});
