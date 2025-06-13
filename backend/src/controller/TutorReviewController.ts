import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TutorReview } from "../entity/TutorReview";
import { Users } from "../entity/User";
import { TutorApplication } from "../entity/TutorApplication";

export class TutorReviewController {
  private reviewRepo = AppDataSource.getRepository(TutorReview);
  private userRepo = AppDataSource.getRepository(Users);
  private appRepo = AppDataSource.getRepository(TutorApplication);

  // Handles the creation or update of a tutor review
  async submit(req: Request, res: Response) {
    console.log("Incoming Review:", req.body); // Logs the review payload for debugging

    const { userId, applicationId, rank, comment } = req.body;

    if (!userId || !applicationId || rank === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      const application = await this.appRepo.findOneBy({ applicationId });

      if (!user || !application) {
        return res
          .status(404)
          .json({ message: "User or application not found." });
      }

      // Check if a review already exists for this user and application
      let review = await this.reviewRepo.findOne({
        where: { user: { id: userId }, application: { applicationId } },
        relations: ["user", "application"],
      });

      // If not, create a new review; otherwise update existing review
      if (!review) {
        review = this.reviewRepo.create({ user, application, rank, comment });
      } else {
        review.rank = rank;
        review.comment = comment;
      }

      const saved = await this.reviewRepo.save(review);
      return res.status(200).json(saved);
    } catch (error) {
      console.error("Error submitting review:", error);
      return res.status(500).json({ message: "Failed to submit review." });
    }
  }

  // Returns all reviews, optionally filtered by applicationId
  async getAll(req: Request, res: Response) {
    try {
      const { applicationId } = req.query;

      const reviews = await this.reviewRepo.find({
        where: applicationId
          ? { application: { applicationId: Number(applicationId) } }
          : {},
        relations: ["user", "application"],
      });

      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Failed to retrieve reviews." });
    }
  }

  // Soft deletes a review by clearing the rank and comment
  async delete(req: Request, res: Response) {
    const { userId, applicationId } = req.body;

    if (!userId || !applicationId) {
      return res
        .status(400)
        .json({ message: "Missing userId or applicationId." });
    }

    try {
      const review = await this.reviewRepo.findOne({
        where: {
          user: { id: userId },
          application: { applicationId: Number(applicationId) },
        },
        relations: ["user", "application"],
      });

      if (!review) {
        return res.status(404).json({ message: "Review not found." });
      }

      // Instead of removing the review, just clear the values
      review.rank = null;
      review.comment = null;

      await this.reviewRepo.save(review); // Saves the soft-deleted state

      return res
        .status(200)
        .json({ message: "Review cleared (soft deleted)." });
    } catch (error) {
      console.error("Failed to soft delete review:", error);
      return res.status(500).json({ message: "Failed to soft delete review." });
    }
  }
}
