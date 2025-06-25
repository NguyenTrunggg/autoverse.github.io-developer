// require("dotenv").config();

// const configCors = (app) => {
//     app.use(function (req, res, next) {
//         res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
//         res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//         res.setHeader(
//             "Access-Control-Allow-Headers",
//             "X-Requested-With,content-type,Authorization"
//         );
//         res.setHeader("Access-Control-Allow-Credentials", true);

//         res.setHeader(
//             "Access-Control-Expose-Headers",
//             "Content-Disposition, content-disposition, Content-Type, content-type"
//         );

//         if (req.method === "OPTIONS") {
//             return res.sendStatus(200);
//         }

//         next();
//     });
// };

// export default configCors;

import cors from "cors";
require("dotenv").config();

const configCors = (app) => {
    app.use(
        cors({
            origin: process.env.REACT_URL, // VD: http://localhost:3000
            credentials: true, // ✅ Cho phép gửi cookie
            exposedHeaders: [
                "Content-Disposition",
                "content-disposition",
                "Content-Type",
                "content-type",
            ],
        })
    );
};

export default configCors;
