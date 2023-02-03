import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/video", function(req: Request, res: Response) {
    res.json({
        "res": req.query.id
    }).send();
});

app.listen(process.env.PORT || 3333);