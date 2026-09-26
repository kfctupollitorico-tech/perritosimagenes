const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/estado", (req, res) => {
    res.json({
        mensaje: "🐶 Servidor funcionando correctamente"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🐶 Servidor funcionando en el puerto ${PORT}`);
});
