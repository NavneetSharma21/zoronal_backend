import { StatusCodes } from "http-status-codes";
class companyService {
    constructor({commonHelpers, tableConstants, fileUpload, companySchema}) {
        this.commonHelpers = commonHelpers;
        this.tableConstants = tableConstants;
        this.fileUpload = fileUpload;
        this.companySchema = companySchema;
    }

    /**
     * service to add company data
     * @param {} reqData 
     * @returns 
     */
    async addCompany(reqUser, reqData, reqFiles){
        try {
            const { name, location, foundedOn, city } = reqData;

            let fileName = ""
            if (reqFiles && reqFiles.image) {
                fileName = await this.fileUpload.uploadSingleFile(reqFiles.image)
            }
    
            const insertCompany = {
                companyName : name,
                location, 
                city,
                foundedOn : `${foundedOn}T00:00:00Z`,
                image : fileName
            }

            await this.companySchema.insertOne(insertCompany);

            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS");
        } catch (error) {
            throw error;
        }
    }

    /**
     * service to fetch company data
     * @param {} reqQuery 
     * @returns 
     */
    async getCompanies(reqQuery) {
        try {
            let { page, search, location, sortBy } = reqQuery

            page = page > 0 ? parseInt(page) : 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            const filter = {};

            // search query for company name and locations
            if (search) {
                filter.$or = [
                    {
                        companyName: { $regex: search, $options: "i" }
                    },
                    {
                        location: { $regex: search, $options: "i" }
                    }
                ];
            }

            // search by the locations only
            if (location) {
                filter.$or = [
                    {
                        location: { $regex: location, $options: "i" }
                    }
                ];
            }

            // sorting based on conditions
            let sortValue = -1;
            let sortKey = "createdAt"
            if(sortBy == 1){
                sortValue = 1
            }else if(sortBy == "avg"){
                sortKey = "averageRating"
                sortValue = -1
            }

            const pipeline = [
                {
                    $match: filter
                },
                // ratings lookup
                {
                    $lookup: {
                        from: "ratings",
                        localField: "_id",
                        foreignField: "companyId",
                        as: "ratings"
                    }
                },

                // calculate average and count
                {
                    $addFields: {

                        averageRating: {
                            $cond: [
                                { $gt: [{ $size: "$ratings" }, 0] },
                                {
                                    $round: [
                                        { $avg: "$ratings.rating" },
                                        1
                                    ]
                                },
                                0
                            ]
                        },

                        reviewCount: {
                            $size: "$ratings"
                        },

                        // image full url
                        image: {
                            $cond: [
                                { $ifNull: ["$image", false] },
                                {
                                    $concat: [
                                        process.env.BASE_URL,
                                        "upload/",
                                        "$image"
                                    ]
                                },
                                null
                            ]
                        }
                    }
                },

                {
                    $project: {
                        ratings: 0
                    }
                },

                {
                    $sort: {
                        [sortKey]: sortValue
                    }
                },

                {
                    $skip: skip
                },

                {
                    $limit: limit
                }
            ];

            const [companies, total] = await Promise.all([
                this.companySchema.aggregate(pipeline),
                this.companySchema.countDocuments(filter),
            ]);

            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", 
                {               
                    data: companies,
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

    /**
     * service to fetch company detail
     * @param {} params 
     * @returns 
     */
    async getCompany(params) {
        try {
            const { id } = params;
            
            const company = await this.companySchema.findById({_id : id}).lean();

            // base url
            const baseUrl = `${process.env.BASE_URL}upload/`;
        
            // append full image url
            const updatedCompanies = {
                ...company,
                image: company.image ? `${baseUrl}${company.image}` : null,
            };

            if (!company) {
                return await this.commonHelpers.prepareResponse(StatusCodes.OK, "INVALID_COMPANY_ID")
            }

            return await this.commonHelpers.prepareResponse(StatusCodes.OK, "SUCCESS", { data: updatedCompanies});
 
        } catch (error) {
            throw error;
        }
    }
}

export default companyService;