import { Router, Request, Response } from "express";
import { DrugController } from "../controllers/DrugController";
import { DrugCreateController } from "../controllers/DrugCreateController";
import { MongooseDrugRepository } from "@/infra/repositories/mongoose/DrugRepository";
import {
  validate,
  validateQueryParams,
  updateDrugSchema,
} from "../middleware/validation";
import { DrugNotFoundError } from "@/domain/errors/DrugNotFoundError";
import { DrugName } from "@/domain/value-objects/DrugName";

const router = Router();
const drugRepository = new MongooseDrugRepository();
const drugController = new DrugController(drugRepository);
const drugCreateController = new DrugCreateController();

/**
 * @swagger
 * /api/drugs:
 *   get:
 *     summary: Get all drugs
 *     tags: [Drugs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of drugs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Drug'
 */
router.get("/", validateQueryParams, async (req: Request, res: Response) => {
  try {
    const { page, limit, search } = req.validatedQuery || {
      page: 1,
      limit: 10,
    };
    const drugs = await drugController.findAll();
    res.json({
      status: "success",
      data: drugs,
      pagination: {
        page,
        limit,
        total: drugs.length,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch drugs",
      });
    }
  }
});

/**
 * @swagger
 * /api/drugs/{name}:
 *   get:
 *     summary: Get a drug by name
 *     tags: [Drugs]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drug found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drug'
 *       404:
 *         description: Drug not found
 */
router.get("/:name", async (req: Request, res: Response) => {
  try {
    const drug = await drugController.findByName(req.params.name);
    if (!drug) {
      throw new DrugNotFoundError(req.params.name);
    }
    res.json({
      status: "success",
      data: drug,
    });
  } catch (error) {
    if (error instanceof DrugNotFoundError) {
      res.status(404).json({
        status: "error",
        message: error.message,
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch drug",
      });
    }
  }
});

/**
 * @swagger
 * /api/drugs:
 *   post:
 *     summary: Create a new drug by name
 *     tags: [Drugs]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the drug to create (defaults to 'Dupixent' if not provided)
 *                 default: Dupixent
 *                 example: Dupixent
 *     responses:
 *       201:
 *         description: Drug created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drug'
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Drug not found in DailyMed
 */
router.post("/", async (req: Request, res: Response) => {
  const { name } = req.body;
  const nameEntity = new DrugName(name);
  
  if (!nameEntity) {
    res.status(400).json({
      status: "error",
      message: "Drug name must be a valid string"
    });
    return;
  }

  const drug = await drugCreateController.createDrug(nameEntity);
  res.status(201).json({
    status: "success",
    data: drug,
  });
});

/**
 * @swagger
 * /api/drugs/{name}:
 *   put:
 *     summary: Update a drug
 *     tags: [Drugs]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDrugRequest'
 *     responses:
 *       200:
 *         description: Drug updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drug'
 *       404:
 *         description: Drug not found
 *       400:
 *         description: Invalid request data
 */
router.put(
  "/:name",
  validate(updateDrugSchema),
  async (req: Request, res: Response) => {
    try {
      await drugController.update({
        ...req.body,
        name: req.params.name,
      });

      // Get the updated drug to return in response
      const updatedDrug = await drugController.findByName(req.params.name);
      if (!updatedDrug) {
        throw new DrugNotFoundError(req.params.name);
      }

      res.json({
        status: "success",
        data: updatedDrug,
      });
    } catch (error) {
      if (error instanceof DrugNotFoundError) {
        res.status(404).json({
          status: "error",
          message: error.message,
        });
      } else if (error instanceof Error) {
        res.status(400).json({
          status: "error",
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Failed to update drug",
        });
      }
    }
  }
);

/**
 * @swagger
 * /api/drugs/{name}:
 *   delete:
 *     summary: Delete a drug
 *     tags: [Drugs]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Drug deleted successfully
 *       404:
 *         description: Drug not found
 */
router.delete("/:name", async (req: Request, res: Response) => {
  try {
    // Check if drug exists before deleting
    const drug = await drugController.findByName(req.params.name);
    if (!drug) {
      throw new DrugNotFoundError(req.params.name);
    }

    await drugController.delete(req.params.name);
    res.status(204).send();
  } catch (error) {
    if (error instanceof DrugNotFoundError) {
      res.status(404).json({
        status: "error",
        message: error.message,
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Failed to delete drug",
      });
    }
  }
});

export default router;
