import db from "../config/db.js";
import GlobalToggleService from '../services/globalToggleService.js';


export default class BusinessModel {
    static async getUserByEmail(email) {
        try {
            // Query the database to get both userId and user_type
            const [rows] = await db.execute('SELECT user_id, user_type FROM users WHERE email = ?', [email]);

            if (rows.length > 0) {
                return rows[0]; // Return the first row which contains id and user_type
            } else {
                return null; // No user found with the given email
            }
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error; // Propagate the error
        }
    }
    static async getRegisteredBusiness(userId) {
        try {
            const [rows] = await db.execute('SELECT * FROM business_details WHERE user_id = ?', [userId]);
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
    static async getEmail(email) {
        const [rows] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
        return rows.length > 0;
    }
    static async getBusinessOwnerByEmail(email) {
        const rows = await db.execute('SELECT user_type FROM users WHERE email = ?', [email]);
        return rows.length > 0 ? rows[0] : null;
    }
    // static async addBusinessEmail (email,businessOwner) {
    //     const [result]= await db.execute('INSERT INTO email_table (email, business_owner) values(?,?)',[email, businessOwner])
    //     return result.insertId;
    // }
    static async setOwner(email) {
        const [result] = await db.execute('UPDATE users SET user_type = "business_owner" WHERE email = ?', [email]);
        return result;
    }
    static async insertNameDetails(name, email, phone, userType) {
        const [result] = await db.execute('INSERT INTO users (name,email, phone_number, user_type) VALUES (?,?,?,?)', [name, email, phone, userType]);
        return result;
    }
    static async addBusinessDetails(businessName, pincode, city, state, category, phone, latitude, longitude, website) {
        console.log('inside addBusinessDetails');
        const [result] = await db.execute(
            'INSERT INTO business_details (business_name, pincode, city, state, category, phone, latitude, longitude, website) VALUES (?,?,?,?,?,?,?,?,?)',
            [businessName, pincode, city, state, category, phone, latitude, longitude, website || null]
        );
        const userId = result.insertId;
        return userId;
    }
    static async getAllBusinessDetails() {
        const [rows] = await db.execute('SELECT * FROM business_details');
        return rows;
    }
    

    static async getBusinessesByCategoryAndSort(category, sortBy, limit, offset, toggle) {
        
        const validSortOptions = {
            rating: 'rating DESC',
            totalRatings: 'total_ratings DESC',
        };
        const orderBy = validSortOptions[sortBy] || validSortOptions.rating;
        
        const query = toggle ? `SELECT SQL_CALC_FOUND_ROWS *
            FROM business_detail
            WHERE category = ? AND ev_station = true
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?`: `SELECT SQL_CALC_FOUND_ROWS *
            FROM business_detail
            WHERE category = ? 
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ? `;
        try {
            const [results] = await db.execute(query, [category, limit, offset]);
            const [[{ total }]] = await db.query('SELECT FOUND_ROWS() AS total');
            return { businesses: results, total };
        } catch (error) {
            console.error('Error fetching businesses by category and sorting:', error);
            throw error;
        }
    }
    
    static async getSuggestions(query) {
        const sql = `
        SELECT DISTINCT name FROM businesses WHERE name LIKE ?
        UNION
        SELECT DISTINCT category FROM businesses WHERE category LIKE ?
    `;
        const params = [`%${query}%`, `%${query}%`];
        const [results] = await db.query(sql, params);
        return results.map(row => Object.values(row)[0]);

    }

    static async saveRating(userId, businessId, rating, review) {
        try {
            // Insert the rating into the database
            const [result] = await db.execute(
                'INSERT INTO reviews (user_id, business_id, rating, review) VALUES (?, ?, ?, ?)',
                [userId, businessId, rating, review]
            );
    
            // Return a success response with the inserted record's ID
            return {
                success: true,
                message: 'Rating saved successfully',
                insertedId: result.insertId, // The ID of the newly inserted record
            };
        } catch (error) {
            // Log the error for debugging
            console.error('Error saving rating:', error);
    
            // Return a failure response with the error details
            return {
                success: false,
                message: 'Failed to save rating',
                error: error.message, // Include error message for debugging
            };
        }
    }
    static async getBusinessDetailsById(id) {
        try {
            const [businessRows] = await db.execute('SELECT * FROM business_detail  WHERE id = ? ', [id]);
            const [reviewRows] = await db.execute('SELECT * FROM reviews WHERE business_id = ?', [id]);
            if(businessRows.length>0){
                const businessDetails = businessRows[0];
                businessDetails.reviews = reviewRows;

                console.log(businessDetails)
                return businessDetails;

            }
            else{
                return null;
            }
        } catch (error) {
            console.error('Error fetching businesses by category:', error);
            throw error; // Propagate the error
        }
    }
    static async hasUserReviewed(id, userId) {
        const [rows] = await db.execute('SELECT * FROM reviews WHERE business_id = ? AND user_id = ?', [id, userId]);
        return rows.length > 0;
    }
    
     // edit
     async getBusinessDetailsById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM businesses WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    // name edit
    async getUsersByUserId(user_id) {
        try {
            // Query to fetch users where the user_id matches the provided value
            const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
            console.log(rows);
            return rows;
        } catch (error) {
            console.error('Error fetching users by user_id:', error);
            throw error;
        }
    }
    
    
    
  
    


    // async  getAllUsersOrderedByName() {
    //     try {
    //         const [rows] = await db.query('SELECT * FROM users ORDER BY name' );
    //         return rows;
    //     } catch (error) {
    //         console.error('Error fetching users:', error);
    //         throw error;
    //     }
    // }
    


}

(async () => {
    const id = 1; // Replace with the desired ID
    const businessDetails = await BusinessModel.getBusinessDetailsById(id);

    if (businessDetails && businessDetails.message !== "No business found with the provided ID") {
        console.log("Business Details from IIFE: ", businessDetails);
    } else {
        console.log("No business found with the given ID.");
    }
})();