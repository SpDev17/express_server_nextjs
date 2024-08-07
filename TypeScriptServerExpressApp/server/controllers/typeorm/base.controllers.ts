import { Router, Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
const apiController = () => {
  const prisma = new PrismaClient();
  const getJson = asyncHandler(async (req: Request, res: Response) => {
    const model = req.params.model;
    console.log("model : " + model);
    const popularProducts = await (prisma as any)[model].findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });

    res.json({ popularProducts });
  });

  const getDashboardMatrix = asyncHandler(
    async (req: Request, res: Response) => {
      const popularProducts = await prisma.products.findMany({
        take: 15,
        orderBy: {
          stockQuantity: "desc",
        },
      });
      const salesSummary = await prisma.salesSummary.findMany({
        take: 5,
        orderBy: {
          date: "desc",
        },
      });
      const purchaseSummary = await prisma.purchaseSummary.findMany({
        take: 5,
        orderBy: {
          date: "desc",
        },
      });
      const expenseSummary = await prisma.expenseSummary.findMany({
        take: 5,
        orderBy: {
          date: "desc",
        },
      });
      const expenseByCategorySummaryRaw =
        await prisma.expenseByCategory.findMany({
          take: 5,
          orderBy: {
            date: "desc",
          },
        });
      const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
        (item) => ({
          ...item,
          amount: item.amount.toString(),
        })
      );

      res.json({
        popularProducts,
        salesSummary,
        purchaseSummary,
        expenseSummary,
        expenseByCategorySummary,
      });
    }
  );

  const getExpensesByCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const expenseByCategorySummaryRaw =
        await prisma.expenseByCategory.findMany({
          orderBy: {
            date: "desc",
          },
        });
      const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
        (item) => ({
          ...item,
          amount: item.amount.toString(),
        })
      );

      res.json(expenseByCategorySummary);
    }
  );

  const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  });

  const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  });
  const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.users.findMany();
    res.json(users);
  });

  return {
    getJson,
    getDashboardMatrix,
    getExpensesByCategory,
    getProducts,
    createProduct,
    getUsers,
  };
};
export default apiController();
