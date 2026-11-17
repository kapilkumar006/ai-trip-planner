import db from "./db.js";

// ==========================================
// AUTOMATIC DATABASE INITIALIZATION
// Automatically creates all tables in MySQL
// (Railway or Local) on startup if not present.
// ==========================================

export const initDatabase = async () => {
  try {
    // 1. Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        first_name varchar(100) NOT NULL,
        last_name varchar(100) NOT NULL,
        email varchar(150) NOT NULL,
        password varchar(255) NOT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 2. Create contact_messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        email varchar(150) NOT NULL,
        subject varchar(200) NOT NULL,
        message text NOT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 3. Create saved_trips table
    await db.query(`
      CREATE TABLE IF NOT EXISTS saved_trips (
        id int(11) NOT NULL AUTO_INCREMENT,
        user_id int(11) NOT NULL,
        origin varchar(255) DEFAULT NULL,
        destination varchar(255) NOT NULL,
        trip_type varchar(100) DEFAULT NULL,
        budget varchar(100) DEFAULT NULL,
        num_days int(11) DEFAULT NULL,
        num_people int(11) DEFAULT NULL,
        itinerary longtext DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        travel_mode varchar(100) DEFAULT NULL,
        health_considerations text DEFAULT NULL,
        mongodb_id varchar(24) DEFAULT NULL,
        PRIMARY KEY (id),
        KEY fk_saved_trips_user (user_id),
        CONSTRAINT fk_saved_trips_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    // 4. Seed initial users if table is empty
    const [userRows] = await db.query("SELECT COUNT(*) as count FROM users");
    if (userRows[0].count === 0) {
      await db.query(`
        INSERT INTO users (id, first_name, last_name, email, password) VALUES
        (1, 'Kapil', 'Kumar', 'kapiltest@example.com', '$2b$10$Q8KZx9cGrLIrnW5uxz8NIu.EJfipNL8645MH6dma55kwhfAoVXHSq'),
        (2, 'Test', 'User', 'testuser@example.com', '$2b$10$C5ttuKLmUkZECI7yCX4NL.Lv8nWvtMzZpI/83qRPK9BPxZCr32.EW'),
        (3, 'sri', 'Kumar', 'srikumartesting@gmail.com', '$2b$10$y3olnO2S9LhWvUOcD.LzR.48L5h/lzBus4D6LFXFYnDr0rx5vRFoS'),
        (4, 'murali', 'k', 'murali@example.com', '$2b$10$sIjn5Ju6M.9iEu8z1E1IDu5b72TETqZ8IfYmVLjpi.R9UiZv4VRkS');
      `);
      console.log("Initial users seeded successfully.");
    }

    // 5. Seed initial contact messages if table is empty
    const [contactRows] = await db.query("SELECT COUNT(*) as count FROM contact_messages");
    if (contactRows[0].count === 0) {
      await db.query(`
        INSERT INTO contact_messages (id, name, email, subject, message) VALUES
        (1, 'kapil', 'kapil@example.com', 'Paris Trip', 'I need more information about a Paris trip.'),
        (2, 'kumar', 'kumar@testing.com', 'for testing', 'justing'),
        (3, 'somu', 'somu@gmail.com', 'testing', 'just for testing'),
        (4, 'rohit', 'roht@gmail.com', 'just for testing', 'just for testing'),
        (5, 'roooohit', 'roooohit@gmail.com', 'DB testing', 'for DB testing on 8/10/26');
      `);
      console.log("Initial contact messages seeded.");
    }

    // 6. Seed saved trips if table is empty
    const [tripRows] = await db.query("SELECT COUNT(*) as count FROM saved_trips");
    if (tripRows[0].count === 0) {
      await db.query(`
        INSERT INTO saved_trips (id, user_id, origin, destination, trip_type, budget, num_days, num_people, travel_mode, health_considerations, mongodb_id) VALUES
        (6, 2, 'Mumbai', 'Maldives', 'Couple', '8888', 2, 2, 'Plane', 'asthma', '6afac3a126bf1ff3a5305f02'),
        (7, 2, 'Dallas', 'Tokyo, Japan', 'Couple', '444444', 2, 2, 'Plane', 'asthma', '6afac42026bf1ff3a5305f03'),
        (8, 2, 'Tokyo', 'Bali, Indonesia', 'Friends', '333333', 2, 3, 'Plane', 'none', '6afc77ac95ed62add2eb7aea');
      `);
      console.log("Initial saved trips seeded.");
    }

    console.log("MySQL database schema verified and ready.");
  } catch (error) {
    console.error("Database auto-init notice:", error.message);
  }
};

export default initDatabase;
