import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TutorReview } from "../entity/TutorReview";
import { Users } from "../entity/User";
import { TutorApplication } from "../entity/TutorApplication";

export class TutorReviewController {
  private reviewRepo = AppDataSource.getRepository(TutorReview);
  private userRepo = AppDataSource.getRepository(Users);
  private appRepo = AppDataSource.getRepository(TutorApplication);

  // POST /tutor-reviews
  async submit(req: Request, res: Response) {
    console.log("Incoming Review:", req.body); // 👈 Add this line
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

      let review = await this.reviewRepo.findOne({
        where: { user: { id: userId }, application: { applicationId } },
        relations: ["user", "application"],
      });

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

  // GET /tutor-reviews
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
  // DELETE /tutor-reviews
  async delete(req: Request, res: Response) {
    const { userId, applicationId } = req.body;

    if (!userId || !applicationId) {
      return res
        .status(400)
        .json({ message: "Missing userId or applicationId." });
    }

    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      const application = await this.appRepo.findOneBy({
        applicationId: Number(applicationId),
      });

      if (!user || !application) {
        return res
          .status(404)
          .json({ message: "User or application not found." });
      }

      const review = await this.reviewRepo.findOne({
        where: {
          user,
          application,
        },
        relations: ["user", "application"],
      });

      if (!review) {
        return res.status(404).json({ message: "Review not found." });
      }

      await this.reviewRepo.remove(review);

      return res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
      console.error("Failed to delete review:", error);
      return res.status(500).json({ message: "Failed to delete review." });
    }
  }
}
