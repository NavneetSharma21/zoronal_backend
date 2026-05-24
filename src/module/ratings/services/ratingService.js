import { StatusCodes } from "http-status-codes";
class ratingService {
    constructor({commonHelpers, ratingSchema}) {
        this.commonHelpers = commonHelpers;
        this.ratingSchema = ratingSchema;
    }

    /**
     * service to add company ratings
     * @param {} reqData 
     * @returns 
     */
    async addRating(reqUser, reqParams, reqData){
        try {
            const { companyId } = reqParams;
            const {
                fullName,
                subject,
                reviewText,
                rating,
            } = reqData;

            if (!companyId) return await this.commonHelpers.prepareResponse(StatusCodes.OK, "INVALID_COMPANY_ID");

            const ratingData = await this.ratingSchema.insertOne({
                companyId,
                fullName,
                subject,
                reviewText,
                rating
            });
         
            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS");

        } catch (error) {
            throw error;
        }
    }

    /**
     * service to fetch company rating data
     * @param {} reqQuery 
     * @returns 
     */
    async getRatings(reqParams, reqQuery) {
        try {
            
            let { page } = reqQuery;
            let { companyId } = reqParams;

            page = page > 0 ? parseInt(page) : 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const filter = { companyId };

            const [ratings, total] = await Promise.all([
                this.ratingSchema.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit).lean(),

                this.ratingSchema.countDocuments(filter),
            ]);

            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", 
                {               
                    data: ratings,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit),
                    }
            });

        } catch (error) {
            throw error
        }
    }
}

export default ratingService;