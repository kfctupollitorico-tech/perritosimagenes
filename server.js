const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json);


// 🔐 PROTECCIÓN DEL PANEL ADMIN
function protegerAdmin(req, res, next) {

    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Basic ")) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Panel de administración"');
        return res.status(401).send("🔐 Se necesita usuario y contraseña");
    }

    const datos = Buffer.from(
        auth.split(" ")[1],
        "base64"
    ).toString();

    const separador = datos.indexOf(":");

    const usuario = datos.substring(0, separador);
    const contraseña = datos.substring(separador + 1);

    if (
        usuario === process.env.ADMIN_USER &&
        contraseña === process.env.ADMIN_PASSWORD
    ) {
        next();
    } else {
        res.setHeader("WWW-Authenticate", 'Basic realm="Panel de administración"');
        return res.status(401).send("❌ Usuario o contraseña incorrectos");
    }
}


// 🔐 Proteger el panel
app.get("/admin.html", protegerAdmin, (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});


// 🔐 Proteger también los datos de las visitas
app.get("/api/visitas", protegerAdmin, (req, res) => {
    res.json(visitas);
});


// Archivos públicos
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


// Comprobar servidor
app.get("/api/estado", (req, res) => {
    res.json({
        mensaje: "🐶 Servidor funcionando correctamente"
    });
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`🐶 Servidor funcionando en el puerto ${PORT}`);
});
