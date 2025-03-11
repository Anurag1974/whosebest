import db from "../config/db.js";
import GlobalToggleService from '../services/globalToggleService.js';


export default class BusinessModel {
    // static async getUserByEmail(email) {
    //     try {
    //         // Query the database to get both userId
    //         const [rows] = await db.execute('SELECT user_id FROM users WHERE email = ?', [email]);

    //         if (rows.length > 0) {
    //             return rows[0]; // Return the first row which contains id and user_type
    //         } else {
    //             return null; // No user found with the given email
    //         }
    //     } catch (error) {
    //         console.error('Error fetching user by email:', error);
    //         throw error; // Propagate the error
    //     }
    // }
    static async getRegisteredBusiness(userId, toggles) {
        let sqlQuery = `
            SELECT 
                bd.*, 
                c.category_name  -- Fetch category name from categories table
            FROM 
                business_detail bd
            LEFT JOIN categories c ON bd.category = c.category_value  -- Join with categories table
            WHERE 
                bd.user_id = ?`;
    
        let queryParams = [userId];
    
        try {
            // Apply toggle filters for EV and Women-Owned businesses
            if (toggles?.ev) {
                sqlQuery += " AND bd.ev_station = 1";
            }
            if (toggles?.women) {
                sqlQuery += " AND bd.women_owned = 1";
            }
    
            const [rows] = await db.execute(sqlQuery, queryParams);
            // console.log(rows)
            return rows;
        } 
        catch (error) {
            console.error('Error fetching business by user id:', error);
            throw error;
        }
    }
    
    
    
    static async getPaidAdvertisements() {
        const query = `
            SELECT b.*, p.priority
            FROM business_detail b
            JOIN paid_advertisements p ON b.id = p.business_id
            ORDER BY p.priority ASC;
        `;
        try {
            const [results] = await db.execute(query);
            return results;
        } catch (error) {
            console.error('Error fetching paid businesses:', error);
            throw error;
        }
    }
    static async getBusinessCount(toggles) {
        try {
            let query = `SELECT category, COUNT(*) AS total_listings FROM business_detail`;
            let conditions = [];
    
            if (toggles.ev) {
                conditions.push(`ev_station = true`);
            }
            if (toggles.women) {
                conditions.push(`women_owned = true`);
            }
    
            // Add WHERE clause if there are conditions
            if (conditions.length > 0) {
                query += ` WHERE ` + conditions.join(" AND ");
            }
    
            query += ` GROUP BY category`;
    
            // Execute the query
            const [results] = await db.execute(query);
    
            // Convert results into an object with category names as keys
            const counts = results.reduce((acc, row) => {
                acc[row.category] = row.total_listings;
                return acc;
            }, {});
            // console.log(counts)
    
            return counts; // Return the object
        } catch (error) {
            throw new Error(`Error fetching category counts: ${error.message}`);
        }
    }
    
    static async getEmail(email) {
        try {
            const [rows] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
            return rows.length > 0; // Returns true if email exists, false otherwise
        } catch (error) {
            console.error("Error in getEmail:", error);
            throw new Error("Database query failed"); // Throw an error for higher-level handling
        }
    }
    
    static async getBusinessOwnerByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT user_type FROM users WHERE email = ?', [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error in getBusinessOwnerByEmail:", error);
            throw new Error("Database query failed"); // Ensures higher-level error handling
        }
    }
    
    // static async addBusinessEmail (email,businessOwner) {
    //     const [result]= await db.execute('INSERT INTO email_table (email, business_owner) values(?,?)',[email, businessOwner])
    //     return result.insertId;
    // }
    static async setOwner(email) {
        try {
            const [result] = await db.execute('UPDATE users SET user_type = "business_owner" WHERE email = ?', [email]);
    
            return result.affectedRows > 0; // Returns true if update was successful
        } catch (error) {
            console.error("Error in setOwner:", error);
            throw new Error("Failed to update user type"); // Ensures higher-level error handling
        }
    }
    
    static async insertNameDetails(name, email, phone, userType) {
        try {
            const [result] = await db.execute(
                'INSERT INTO users (name, email, phone_number, user_type) VALUES (?, ?, ?, ?)', 
                [name, email, phone, userType]
            );
    
            return result.insertId; // Returns the inserted user's ID
        } catch (error) {
            console.error("Error in insertNameDetails:", error);
            throw new Error("Failed to insert user details"); // Ensures higher-level error handling
        }
    }
    
    static async addBusinessDetails(businessName, address, category, phone,  city, state, website, evCharging, womenOwned, userId) {
        try {
            const [result] = await db.execute(
                'INSERT INTO business_detail (business_name, address, category, phone, city, state, website, ev_station, women_owned, user_id) VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?, ?)',
                [businessName, address, category, phone,  city, state, website, evCharging, womenOwned, userId]
            );
    
            return result.insertId; // Return the ID of the newly inserted business
        } catch (error) {
            console.error("Error in addBusinessDetails:", error);
            throw new Error("Failed to add business details");
        }
    }
    
    

    //update new business

    static async updateBusinessDetails(
        businessId, businessName, address,  phone, website, state, city, overview, usp, 
        service1, service2, service3, service4
    ) {
        // console.log('Updating Business Details:', { 
        //     businessId, businessName, address, category, phone, website, state, city, overview, usp, 
        //     service1, service2, service3, service4
        // });
    
        try {
            let query = `UPDATE business_detail SET 
                business_name = ?, 
                address = ?, 
               
                phone = ?, 
                website = ?, 
                state = ?, 
                city = ?, 
                overview = ?, 
                usp = ?`;
    
            let values = [
                businessName, address, phone, website, state, city, overview, usp
            ];
    
            // Dynamically add service fields and handle empty values
            if (service1 === null || service1 === '') {
                query += `, services1 = ''`;  // Save empty string
            } else if (service1) {
                query += `, services1 = ?`;
                values.push(service1);
            }
            
            if (service2 === null || service2 === '') {
                query += `, services2 = ''`;  // Save empty string
            } else if (service2) {
                query += `, services2 = ?`;
                values.push(service2);
            }
    
            if (service3 === null || service3 === '') {
                query += `, services3 = ''`;  // Save empty string
            } else if (service3) {
                query += `, services3 = ?`;
                values.push(service3);
            }
    
            if (service4 === null || service4 === '') {
                query += `, services4 = ''`;  // Save empty string
            } else if (service4) {
                query += `, services4 = ?`;
                values.push(service4);
            }
    
            query += ` WHERE id = ?`;
            values.push(businessId);
    
            // console.log('Final Query:', query);
            // console.log('Values:', values);
    
            const [result] = await db.execute(query, values);
    
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Database Update Error:', error);
            throw error;
        }
    }
    
    
    
    static async addBusinessImages(businessId, imageUrls) {
        try {
            // Insert the image URLs into the business_images table
            const values = imageUrls.map(url => [businessId, url]);
            await db.query(`
                INSERT INTO business_images (business_id, image_path) 
                VALUES ?`, [values]);
    
        } catch (error) {
            console.error("Error adding business images:", error);
            throw error;
        }
    }

    static async updateThumbnail(businessId, thumbnailUrl) {
        try {
            await db.execute(`
                UPDATE business_detail
                SET image_source = ?
                WHERE id = ?`, [thumbnailUrl, businessId]);
        } catch (error) {
            console.error("Error updating thumbnail:", error);
            throw error;
        }
    }
    
   
    
    // Fetch Business Details by ID
    static async getBusinessById(businessId) {
        try {
            const [result] = await db.execute(
                'SELECT * FROM business_detail WHERE id = ?',
                [businessId]
            );
            return result.length ? result[0] : null;
        } catch (error) {
            console.error('Database Fetch Error:', error);
            throw error;
        }
    }


    static async updateName(userId, name, phoneNumber, email, profileImage) {
        try {
            // console.log(`Updating user ${userId} with name=${name}, phone=${phoneNumber}`);
    
            let sql, values;
    
            // If a new profile image is uploaded, save the path
            let profileImagePath = profileImage ? `/uploads/${userId}/profile/${profileImage}` : null;
    
            if (profileImage) {
                sql = "UPDATE users SET name = ?, phone_number = ?, email = ?, profile_image = ? WHERE user_id = ?";
                values = [name, phoneNumber, email, profileImagePath, userId];
            } else {
                sql = "UPDATE users SET name = ?, phone_number = ?, email = ? WHERE user_id = ?";
                values = [name, phoneNumber, email, userId];
            }
    
            const [result] = await db.execute(sql, values);
            // console.log(result);
            return result;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }
    
  
    static async getAllBusinessDetails() {
        try {
            const [rows] = await db.execute('SELECT * FROM business_details');
            return rows;
        } catch (error) {
            console.error("Error fetching all business details:", error);
            throw new Error("Failed to retrieve business details");
        }
    }
    

    // static async getBusinessesByCategoryAndSort(category, sortBy, limit, offset, toggles) {
    //     const validSortOptions = {
    //         rating: 'rating DESC',
    //         totalRatings: 'total_ratings DESC',
    //     };
    //     const orderBy = validSortOptions[sortBy] || validSortOptions.rating;
    
    //     let query = `SELECT SQL_CALC_FOUND_ROWS * FROM business_detail WHERE category = ?`;
    //     let conditions = [];
    //     let params = [category];
    
    //     // console.log("Received Toggles:", toggles); // Debugging toggle input
    
    //     if (toggles?.ev) {
    //         conditions.push(`ev_station = 1`);
    //     }
    //     if (toggles?.women) {
    //         conditions.push(`women_owned = 1`);
    //     }
    
    //     // Append conditions if exist
    //     if (conditions.length > 0) {
    //         query += ` AND ` + conditions.join(" AND ");
    //     }
    
    //     query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    //     params.push(limit, offset);
    
    //     // console.log("Executing Query:", query, "Params:", params); // Debugging query formation
    
    //     try {
    //         const [results] = await db.execute(query, params);
    //         const [[{ total }]] = await db.query('SELECT FOUND_ROWS() AS total');
    
    //         // console.log("Query Results:", results.length, "Total:", total); // Debugging result count
    //         return { businesses: results, total };
    //     } catch (error) {
    //         console.error('Error fetching businesses by category and sorting:', error);
    //         throw error;
    //     }
    // }
    static async getBusinessesByCategoryAndSort(category, sortBy, limit, offset, toggles) {
        const validSortOptions = {
            rating: 'avg_rating DESC, total_ratings DESC', // Prioritize avg_rating, then total_ratings
            totalRatings: 'total_ratings DESC'
        };
        const orderBy = validSortOptions[sortBy] || validSortOptions.rating;
    
        let query = `
            SELECT SQL_CALC_FOUND_ROWS bd.*, 
                   COALESCE(AVG(r.rating), 0) AS avg_rating, 
                   COUNT(r.review_id) AS total_ratings
            FROM business_detail bd
            LEFT JOIN reviews r ON bd.id = r.business_id
            WHERE bd.category = ?
        `;
    
        let conditions = [];
        let params = [category];
    
        // Apply toggle conditions
        if (toggles?.ev) {
            conditions.push(`bd.ev_station = 1`);
        }
        if (toggles?.women) {
            conditions.push(`bd.women_owned = 1`);
        }
    
        // Append conditions if exist
        if (conditions.length > 0) {
            query += ` AND ` + conditions.join(" AND ");
        }
    
        query += ` 
            GROUP BY bd.id
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?
        `;
    
        params.push(limit, offset);
    
        try {
            const [results] = await db.execute(query, params);
            const [[{ total }]] = await db.query('SELECT FOUND_ROWS() AS total');
            // console.log(results);
            return { businesses: results, total };
        } catch (error) {
            console.error('Error fetching businesses by category and sorting:', error);
            throw error;
        }
    }
    
    
    


    static async getUserRating(userId, businessId) {
        try {
            const [existingRating] = await db.execute(
                'SELECT rating, review FROM reviews WHERE user_id = ? AND business_id = ?',
                [userId, businessId]
            );
            return existingRating.length > 0 ? existingRating[0] : { rating: null, review: '' };
        } catch (error) {
            console.error('Database Error fetching rating:', error);
            throw error;
        }
    }

    
    static async saveRating(userId, businessId, rating, review) {
        try {
            // Check if the user has already rated this business
            const [existingRating] = await db.execute(
                'SELECT * FROM reviews WHERE user_id = ? AND business_id = ?',
                [userId, businessId]
            );
    
            if (existingRating.length > 0) {
                // If rating exists, update it
                await db.execute(
                    'UPDATE reviews SET rating = ?, review = ? WHERE user_id = ? AND business_id = ?',
                    [rating, review, userId, businessId]
                );
    
                return {
                    success: true,
                    message: 'Rating updated successfully',
                };
            } else {
                // If no existing rating, insert a new one
                const [result] = await db.execute(
                    'INSERT INTO reviews (user_id, business_id, rating, review) VALUES (?, ?, ?, ?)',
                    [userId, businessId, rating, review]
                );
    
                return {
                    success: true,
                    message: 'Rating saved successfully',
                    insertedId: result.insertId,
                };
            }
        } catch (error) {
            console.error('Error saving rating:', error);
            return {
                success: false,
                message: 'Failed to save rating',
                error: error.message,
            };
        }
    }

    //fetch if testimonial is exist for not 
    static async getTestimonialByUserId(user_id) {
        const query = `
            SELECT t.id, u.name 
            FROM testimonials t
            JOIN users u ON t.user_id = u.user_id
            WHERE t.user_id = ?
        `;
        
        try {
            const [result] = await db.query(query, [user_id]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error("Error fetching testimonial with user details:", error);
            throw error;
        }
    }

    // if testimonial exist then run this function
    static async updateTestimonial(user_id, name, city, country, rating, reviews) {
        const query = `
            UPDATE testimonials 
            SET name = ?, city = ?, country = ?, rating = ?, reviews = ?, updated_at = NOW()
            WHERE user_id = ?
        `;
        const values = [name, city, country, rating, reviews, user_id];
    
        try {
            const [result] = await db.query(query, values);
            // console.log("Testimonial Updated:", result);
            return result;
        } catch (error) {
            // console.error("Database Error:", error.message);
            throw error;
        }
    }

    // if testimonial is not exist then run this function to create a testimonial
    static async createTestimonial(user_id, name, city, country, rating, reviews) {
        const query = `
            INSERT INTO testimonials (user_id, name, city, country, rating, reviews, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const values = [user_id, name, city, country, rating, reviews];
    
        try {
            const [result] = await db.query(query, values);
            // console.log("New Testimonial Added:", result);
            return result;
        } catch (error) {
            // console.error("Database Error:", error.message);
            throw error;
        }
    }
    
    static async getTestimonialByUserId(user_id) {
        const query = `SELECT name, city, country, rating, reviews FROM testimonials WHERE user_id = ?`;
        
        try {
            const [result] = await db.query(query, [user_id]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error(`❌ Error fetching testimonial for user_id ${user_id}:`, error);
            return null; // Return null if an error occurs
        }
    }
    
    
    
    
    
    // fetching testominals

    static async getTestimonials() {
        const query = `
           SELECT 
    t.id, 
    t.name, 
    t.city, 
    t.country, 
    t.rating, 
    t.reviews, 
    t.created_at, 
    u.profile_image 
FROM 
    testimonials t
JOIN 
    users u ON t.user_id = u.user_id
WHERE 
    t.rating >3
ORDER BY 
    t.created_at DESC
LIMIT 10;

        `;
    
        try {
            const [results] = await db.query(query);
            // console.log(results)
            return results;
        } catch (error) {
            // console.error("Error fetching testimonials:", error.message);
            throw error;
        }
    }
    
    
    static async getBusinessDetailsById(id) {
        try {
                // const [businessRows] = await db.execute('SELECT * FROM business_detail  WHERE id = ? ', [id]);
                const [businessRows] = await db.execute(
                    `SELECT 
    bd.*, 
    bh.opening_time, 
    bh.closing_time, 
    COALESCE(GROUP_CONCAT(DISTINCT bi.image_path SEPARATOR '||'), '') AS images,
    COUNT(DISTINCT bi.id) AS image_count  -- Use DISTINCT here
FROM business_detail bd
LEFT JOIN business_hours bh ON bd.id = bh.business_id
LEFT JOIN business_images bi ON bd.id = bi.business_id
WHERE bd.id = ? 
  AND (bh.opening_time IS NULL OR bh.opening_time != '00:00:00') 
  AND (bh.closing_time IS NULL OR bh.closing_time != '00:00:00')
GROUP BY bd.id;





`, 
                    [id]
                );
                console.log(businessRows)
                // console.log(businessRows)
                
                const [reviewRows] = await db.execute(`SELECT reviews.*, users.name, users.profile_image
                FROM reviews
                JOIN users ON reviews.user_id = users.user_id
                 WHERE reviews.business_id = ?`, [id]);

            if (businessRows.length > 0) {
                const businessDetails = businessRows[0];
                businessDetails.reviews = reviewRows;

                // console.log("this is "+businessDetails)
                
                return businessDetails;

            }
            else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching businesses by category:', error);
            throw error; // Propagate the error
        }
    }
    static async getBusinessReview(businessId) {
        try {
            const [reviews] = await db.execute(
                `SELECT  r.business_id, r.review,r.rating ,r.created_at, 
                        u.name 
                 FROM reviews r
                 JOIN users u ON r.user_id = u.user_id
                 WHERE r.business_id = ? 
                 ORDER BY r.created_at DESC`,
                [businessId]
            );
            return reviews;
        } catch (error) {
            console.error("Error fetching business reviews:", error);
            throw error;
        }
    }
    static async getOffDays(businessId) {
        try {
            const query = `
                SELECT day_of_week 
                FROM business_hours 
                WHERE opening_time = '00:00:00' 
                  AND closing_time = '00:00:00'
                  AND business_id = ?
            `;
            
            const [rows] = await db.execute(query, [businessId]);  // Pass businessId as a parameter
            // console.log('days off', rows);
            
            // Convert [{ day_of_week: 'Saturday' }, { day_of_week: 'Sunday' }] to ['Saturday', 'Sunday']
            return rows.map(row => row.day_of_week);
        } catch (error) {
            console.error("Error fetching off days:", error);
            return [];
        }
    }
    
    static async getReviewCount(businessId) {
        try {
            const query = `
                SELECT 
                    COUNT(*) AS review_count, 
                    COALESCE(AVG(rating), 0) AS average_rating
                FROM reviews 
                WHERE business_id = ?;
            `;
            
            const [rows] = await db.execute(query, [businessId]);
    
            if (!rows.length) {
                return { review_count: 0, average_rating: "No rating" };
            }
    
            return {
                review_count: rows[0].review_count || 0,
                average_rating: parseFloat(rows[0].average_rating).toFixed(1) // Format to 1 decimal place
            };
        } catch (error) {
            console.error("Error fetching review count:", error);
            return { review_count: 0, average_rating: "No rating" }; // Return default values in case of error
        }
    }
    
    
    static async deleteReviewById(reviewId) {
        const sql = "DELETE FROM reviews WHERE review_id = ?";
        
        try {
            const [result] = await db.execute(sql, [reviewId]);
            return result.affectedRows > 0; // Return true if at least one row was deleted
        } catch (error) {
            console.error(`❌ Error deleting review with ID ${reviewId}:`, error);
            return false; // Return false in case of an error
        }
    }
    
    static async hasUserReviewed(businessId, userId) {
        try {
            // console.log(`Checking review for businessId: ${businessId}, userId: ${userId}`);
            
            if (!businessId || !userId) {
                console.error("Error: businessId or userId is missing!");
                return false;
            }
    
            const [rows] = await db.execute('SELECT * FROM reviews WHERE business_id = ? AND user_id = ?', [businessId, userId]);
    
            // console.log("Query result:", rows);
            return rows.length > 0;
        } catch (error) {
            console.error("Database error in hasUserReviewed:", error);
            return false;
        }
    }
    

   

    static async getUserByUserId(userId) {
        try {

            const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
            // console.log(rows[0]);
            return rows ? rows[0] : null;
        } catch (error) {
            console.error('Error fetching users by user_id:', error);
            throw error;
        }
    }


   

    // user update information name,phone_number
    static async updateInformation(name, phone_number, callback) {
        try {
            const [results] = await db.query(
                'UPDATE users SET name = ? WHERE phone_number = ?',
                [name, phone_number]
            );
            callback(null, results);
        } catch (err) {
            callback(err, null);
        }
    }



    static async filterBusiness(city, category, toggles, limit, offset) {
        let sqlQuery = `
            SELECT SQL_CALC_FOUND_ROWS bd.*, 
                   COALESCE(AVG(r.rating), 0) AS avg_rating, 
                   COUNT(r.review_id) AS total_ratings
            FROM business_detail bd
            LEFT JOIN reviews r ON bd.id = r.business_id
            WHERE 1=1
        `;
        let queryParams = [];
    
        try {
            // Apply city filter
            if (city) {
                sqlQuery += " AND bd.city = ?";
                queryParams.push(city);
            }
    
            // Apply category filter
            if (category) {
                sqlQuery += " AND bd.category = ?";
                queryParams.push(category);
            }
    
            // Apply toggle filters for EV and Women-Owned
            if (toggles?.ev) {
                sqlQuery += " AND bd.ev_station = 1";
            }
            if (toggles?.women) {
                sqlQuery += " AND bd.women_owned = 1";
            }
    
            // Group results to calculate avg_rating and total_ratings correctly
            sqlQuery += ` 
                GROUP BY bd.id
                ORDER BY avg_rating DESC
                LIMIT ? OFFSET ?
            `;
    
            queryParams.push(limit, offset);
    
            // console.log("Executing Query:", sqlQuery, "Params:", queryParams);
            const [businesses] = await db.execute(sqlQuery, queryParams);
            const [[{ total }]] = await db.query("SELECT FOUND_ROWS() AS total");
    
            return { businesses, total };
        } catch (error) {
            console.error("Error fetching data:", error);
            throw new Error("Failed to fetch businesses");
        }
    }
    
    

    static async getTopRatedBusinessPerCategory() {
        const query = `
            WITH ranked_businesses AS (
                SELECT 
                    bd.id, 
                    bd.business_name, 
                    bd.address, 
                    bd.phone,
                    bd.image_source, 
                    bd.category, 
                    c.category_name,  -- Fetch category name from categories table
                    bd.website,
                    u.profile_image,  
                    COUNT(r.review_id) AS total_ratings,  -- Count of total reviews
                    COALESCE(AVG(r.rating), 0) AS avg_rating,  -- Calculate average rating
                    (COUNT(r.review_id) * COALESCE(AVG(r.rating), 0)) / (COUNT(r.review_id) + 1) AS weighted_score, -- Weighted formula
                    ROW_NUMBER() OVER (PARTITION BY bd.category ORDER BY weighted_score DESC) AS rank
                FROM 
                    business_detail bd
                LEFT JOIN reviews r ON bd.id = r.business_id
                LEFT JOIN users u ON bd.user_id = u.user_id  
                LEFT JOIN categories c ON bd.category = c.category_value  -- Join with categories table
                GROUP BY 
                    bd.id, bd.category, c.category_name, u.profile_image
                HAVING total_ratings > 0  -- Exclude businesses with 0 reviews
            )
            SELECT 
                id, 
                business_name, 
                address, 
                phone,
                image_source, 
                category, 
                category_name,  -- Include category name in final result
                website,
                profile_image,  
                avg_rating,
                total_ratings
            FROM 
                ranked_businesses
            WHERE 
                rank = 1;
        `;
    
        try {
            const [businesses] = await db.execute(query);  
            return businesses;
        } catch (error) {
            console.error('Error fetching top-rated businesses:', error);
            throw new Error("Failed to fetch top-rated businesses per category");
        }
    }
    
    
    
    static async getBusinessHours(businessId) {
        try {
            const sql = "SELECT day_of_week, opening_time, closing_time FROM business_hours WHERE business_id = ?";
            const [result] = await db.execute(sql, [businessId]);
            return result;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Insert business hours for selected days
    static async insertBusinessHours(businessId, schedule) {
        try {
            // Assuming you have a `business_hours` table
            // Loop through the schedule to insert/update each day's hours
            for (const daySchedule of schedule) {
                const { day, openingTime, closingTime } = daySchedule;
                
                // Assuming you're using SQL queries, adjust the query based on your DB
                const query = `
                    INSERT INTO business_hours (business_id, day_of_week, opening_time, closing_time)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE opening_time = ?, closing_time = ?;
                `;
                const params = [businessId, day, openingTime, closingTime, openingTime, closingTime];

                // Execute the query (this depends on your database client)
                await db.query(query, params);  // Assuming db is your database connection object
            }

            return { success: true }; // Return success status or any relevant data

        } catch (error) {
            console.error("Error in insertBusinessHours:", error.message);
            throw error;  // Rethrow the error to be handled by the controller
        }
    }

    // Update business hours for selected days
    static async updateBusinessHours(businessId, selectedDays, openingTime, closingTime) {
        try {
            // Log the parameters to verify their values and types
            // console.log('Updating business hours with parameters:');
            // console.log('businessId:', businessId);
            // console.log('selectedDays:', selectedDays);
            // console.log('openingTime:', openingTime);
            // console.log('closingTime:', closingTime);

            // Ensure selectedDays is an array
            if (!Array.isArray(selectedDays) || selectedDays.length === 0) {
                throw new Error("selectedDays must be a non-empty array.");
            }

            const updateQuery = `
                UPDATE business_hours 
                SET opening_time = ?, closing_time = ?
                WHERE business_id = ? AND day_of_week = ?`;

            // Loop through each day and update the database
            const updatePromises = selectedDays.map(async (dayOfWeek) => {
                // console.log("Executing Query:", updateQuery);
                // console.log("Parameters:", [openingTime, closingTime, businessId, dayOfWeek]);

                // return db.execute(updateQuery, [openingTime, closingTime, businessId, dayOfWeek]);
                const [result] = await db.execute(updateQuery, [openingTime, closingTime, businessId, dayOfWeek]);
    
                // console.log(`✅ Update Result for ${dayOfWeek}:`, result);
            
                if (result.affectedRows === 0) {
                    console.warn(`⚠️ No rows updated for ${dayOfWeek}. Possible reasons:`);
                    console.warn(`   - No matching row found in database`);
                    console.warn(`   - Data already matches (MySQL ignores unchanged updates)`);
                }
            });

            // Execute all updates
            await Promise.all(updatePromises);

            return { message: "Business hours updated successfully for selected days" };
        } catch (error) {
            // Log the error for debugging
            console.error("Database Update Error:", error);
            throw new Error("Database Update Error: " + error.message);
        }
    }


    static async getUserByEmail(email) {
        try {
            const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
            return user;
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw error;
        }
    }

    static async createUser(username, email, hashedPassword,phone,termAndCondition) {
        try {
            await db.execute("INSERT INTO users (name, email, password_hash,phone_number,term_conditions) VALUES (?, ?, ? ,?,?)", [
                username,
                email,
                hashedPassword,
                phone,
                termAndCondition
            ]);
            return { success: true, message: "User created successfully" };
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }
    // delete business model 
    static async deleteBusinessById(businessId) {
        try {
            // Ensure the business belongs to the user before deleting
            

            // Delete business
            await db.execute("DELETE FROM business_detail WHERE id = ?", [businessId]);
            return true;
        } catch (error) {
            console.error("Error deleting business:", error);
            throw error;
        }
    }
    static async getReviewRecentActivity() {
        try {
            const query = `
                SELECT r.*, 
                u.name , u.profile_image,
                b.business_name, b.city, b.category,b.image_source,b.phone
                FROM reviews r
                JOIN users u ON r.user_id = u.user_id
                JOIN business_detail b ON r.business_id = b.id
                ORDER BY r.created_at DESC
                LIMIT 6
            `;

            const [rows] = await db.execute(query);
            // console.log(rows)
            return rows;
        } catch (error) {
            // console.error("Error fetching recent reviews:", error);
            throw error;
        }
    }
   

    static async getDriverByUserId(userId) {
        try {
            const [driver] = await db.execute("SELECT * FROM driver_data WHERE user_id = ?", [userId]);
            return driver.length > 0 ? driver[0] : null; // Return first driver if exists, otherwise null
        } catch (error) {
            console.error("Error fetching driver by user ID:", error);
            throw error;
        }
    }
    
    static async getPinkDriverByUserId(userId) {
        try {
            const [driver] = await db.execute("SELECT * FROM pink_driver_data WHERE user_id = ?", [userId]);
            return driver.length > 0 ? driver[0] : null; // Return first driver if exists, otherwise null
        } catch (error) {
            console.error("Error fetching driver by user ID:", error);
            throw error;
        }
    }
    
    // static async insertDriverDetails(data) {
    //     try {
    //         const query = `
    //             INSERT INTO driver_data 
    //             (user_id, name, age, gender, phone_number, email, driving_experience, city, state, 
    //             vehicle_type, vehicle_number, vehicle_name, current_address, license_address, 
    //             vehicle_image, dl_front, dl_back, driver_image, license_number,registered_date,term_conditions) 
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,NOW(),1)
    //         `;
    
    //         const values = [
    //             data.user_id, data.name, data.age, data.gender, data.phone_number, data.email,
    //             data.driving_experience, data.city, data.state, data.vehicle_type,
    //             data.vehicle_number, data.vehicle_name, data.current_address, data.license_address,
    //             data.vehicle_image, data.license_front, data.license_back, data.driver_photo,data.license_number
    //         ];
    
    //         const [result] = await db.execute(query, values);
    
    //         console.log("🔹 MySQL Execution Result:", result);
    
    //         if (result.affectedRows > 0) {
    //             return { success: true, message: "Driver details inserted successfully" };
    //         } else {
    //             return { success: false, message: "No rows inserted in database" };
    //         }
    //     } catch (error) {
    //         console.error("❌ Database Error:", error);
    //         return { success: false, message: "Failed to insert driver details" };
    //     }
    // }

    
    static async checkExistingDriver(email, licenseNumber, licensePlate) {
        const sql = `SELECT COUNT(*) AS count FROM driver_data WHERE email = ? OR license_number = ? OR vehicle_number = ?`;
        const [rows] = await db.execute(sql, [email, licenseNumber, licensePlate]);
    
        return rows[0].count > 0; // Returns true if at least one record exists, otherwise false
    }

    static async checkPinkExistingDriver(email, licenseNumber, licensePlate) {
        const sql = `SELECT COUNT(*) AS count FROM pink_driver_data WHERE email = ? OR license_number = ? OR vehicle_number = ?`;
        const [rows] = await db.execute(sql, [email, licenseNumber, licensePlate]);
    
        return rows[0].count > 0; // Returns true if at least one record exists, otherwise false
    }
    
    

    static async registerDriver(driverData) {
        const {
            driverUserId, name, phone, email, age, gender, experience,
            city, state, vehicleType, vehicleName, licensePlate,
            currentAddress, licenseAddress, licenseNumber,
            vehicleImage, licenseFront, licenseBack, driverPhoto
        } = driverData;

        const query = `
            INSERT INTO driver_data (
                user_id, name, phone_number, email, age, gender, driving_experience, city, state,
                vehicle_type, vehicle_name, vehicle_number, current_address, license_address, license_number,
                vehicle_image, dl_front, dl_back, driver_image,registered_date,term_conditions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,NOW(), 1)
        `;

        const values = [
            driverUserId, name, phone, email, age, gender, experience, city, state,
            vehicleType, vehicleName, licensePlate, currentAddress, licenseAddress, licenseNumber,
            vehicleImage, licenseFront, licenseBack, driverPhoto
        ];

        try {
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async registerPinkDriver(driverData) {
        const {
            driverUserId, name, phone, email, age, experience,
            city, state, vehicleType, vehicleName, licensePlate,
            currentAddress, licenseAddress, licenseNumber,
            vehicleImage, licenseFront, licenseBack, driverPhoto
        } = driverData;

        const query = `
            INSERT INTO pink_driver_data (
                user_id, name, phone_number, email, age, driving_experience, city, state,
                vehicle_type, vehicle_name, vehicle_number, current_address, license_address, license_number,
                vehicle_image, dl_front, dl_back, driver_image,registered_date,term_conditions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,NOW(), 1)
        `;

        const values = [
            driverUserId, name, phone, email, age, experience, city, state,
            vehicleType, vehicleName, licensePlate, currentAddress, licenseAddress, licenseNumber,
            vehicleImage, licenseFront, licenseBack, driverPhoto
        ];

        try {
            const [result] = await db.execute(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }
    static async updateDriverStatus(driverId, status) {
        try {
            // console.log(`Updating driver ${driverId} with status=${status}`);
    
            // Fetch current status for debugging
            const [currentStatus] = await db.execute(
                "SELECT status FROM driver_data WHERE user_id = ?",
                [driverId]
            );
            // console.log("Current Status:", currentStatus);
    
            // Update query
            const sql = "UPDATE driver_data SET status = ? WHERE user_id = ?";
            const values = [status, driverId];
    
            const [result] = await db.execute(sql, values);
            // console.log("Update Result:", result);
    
            return result;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }
    static async updatePinkDriverStatus(driverId, status) {
        try {
            // console.log(`Updating driver ${driverId} with status=${status}`);
    
            // Fetch current status for debugging
            const [currentStatus] = await db.execute(
                "SELECT status FROM pink_driver_data WHERE user_id = ?",
                [driverId]
            );
            // console.log("Current Status:", currentStatus);
    
            // Update query
            const sql = "UPDATE pink_driver_data SET status = ? WHERE user_id = ?";
            const values = [status, driverId];
    
            const [result] = await db.execute(sql, values);
            // console.log("Update Result:", result);
    
            return result;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    static async getAvailableTaxis() {
        try {
            const [drivers] = await db.execute("SELECT * FROM driver_data WHERE status = 1 and verified=1");
            //  console.log(drivers)
            return drivers; // Returns an array of available drivers
        } catch (error) {
            console.error("Error fetching available taxis:", error);
            throw error;
        }
    }
    
    static async getAvailablePinkTaxis() {
        try {
            const [drivers] = await db.execute("SELECT * FROM pink_driver_data WHERE status = 1 and verified=1");
            // console.log(drivers)
            return drivers; // Returns an array of available drivers
        } catch (error) {
            console.error("Error fetching available taxis:", error);
            throw error;
        }
    }
    static async getBusinessesByCategory() {
        try {
            const query = "SELECT category_name, category_value FROM categories";
            const [rows] = await db.execute(query);
            // console.log(rows)
            return rows;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }

    static async getCategoryByBusiness(businessCategory) {
        try {
            const query = "SELECT category_name FROM categories WHERE category_value = ?";
            const [rows] = await db.execute(query, [businessCategory]);
            return rows.length > 0 ? rows[0].category_name : null;
        } catch (error) {
            console.error("Error fetching category by business:", error);
            throw error;
        }
    }

    
        static async getPopperCategories() {
            try {
                const sql = `SELECT category_name, category_value, category_icon FROM categories`;
                const [rows] = await db.execute(sql);
                // console.log(rows)
                return rows;
            } catch (error) {
                console.error("Error fetching categories:", error);
                throw error;
            }
        }    
    
    
    
    
    
    
    
}
