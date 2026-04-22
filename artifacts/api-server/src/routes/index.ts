import { Router, type IRouter } from "express";
import healthRouter from "./health";
import downloadRouter from "./download";
import chainRouter from "./chain";

const router: IRouter = Router();

router.use(healthRouter);
router.use(downloadRouter);
router.use(chainRouter);

export default router;
