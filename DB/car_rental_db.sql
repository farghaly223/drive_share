-- 1. جدول المستخدمين (يشمل الـ Admin, Owner, Renter)
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'owner', 'renter') NOT NULL,
    account_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    driver_license_url VARCHAR(255), -- مخصص للمستأجر فقط
    is_license_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول السيارات
CREATE TABLE Cars (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL, -- FK يربط السيارة بمالكها
    title VARCHAR(200) NOT NULL,
    description TEXT,
    car_type VARCHAR(50),
    brand VARCHAR(50),
    model VARCHAR(50),
    year INT,
    transmission ENUM('automatic', 'manual'),
    location VARCHAR(100),
    rental_price DECIMAL(10, 2),
    post_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. جدول الحجوزات (الذي يربط المستأجر بالسيارة)
CREATE TABLE Bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL, -- FK يربط الحجز بالسيارة
    renter_id INT NOT NULL, -- FK يربط الحجز بالمستأجر
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10, 2),
    status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES Cars(id) ON DELETE RESTRICT, -- لمنع حذف سيارة محجوزة
    FOREIGN KEY (renter_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 4. جدول التقييمات
CREATE TABLE Reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL, -- FK يربط التقييم برحلة معينة
    car_id INT NOT NULL,
    renter_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES Cars(id) ON DELETE CASCADE,
    FOREIGN KEY (renter_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- الشخص المستلم للإشعار
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Car_Images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL, -- لينك الصورة (زي Firebase أو Local Path)
    is_main BOOLEAN DEFAULT FALSE, -- عشان تحدد مين الصورة اللي تظهر في البحث (Cover)
    FOREIGN KEY (car_id) REFERENCES Cars(id) ON DELETE CASCADE
);



-- 1. إضافة مستخدم (Owner) عشان يملك العربيات دي
INSERT INTO Users (name, email, password, role, account_status) 
VALUES ('Car Provider Co.', 'provider@cars.com', '123456', 'owner', 'approved');

INSERT INTO Cars 
(owner_id, title, description, car_type, brand, model, year, transmission, location, rental_price, post_status) 
VALUES
(1, 'Luxury Tesla Experience', 'Experience the future with this fully electric Tesla Model 3. Autopilot enabled and premium interior.', 'Sedan', 'Tesla', 'Model 3', 2023, 'automatic', 'Cairo', 2500.00, 'approved'),

(1, 'Fast & Furious BMW', 'A high-performance M4 for those who love speed and luxury. Perfect for special events.', 'Sports', 'BMW', 'M4', 2022, 'automatic', 'Alexandria', 3500.00, 'approved'),

(1, 'Reliable Toyota Corolla', 'The most reliable car for city trips. Very fuel-efficient and comfortable for small families.', 'Sedan', 'Toyota', 'Corolla', 2021, 'automatic', 'Giza', 800.00, 'approved'),

(1, 'Sporty Mercedes Benz', 'The C200 combines elegance with a sporty feel. Latest technology and very smooth driving.', 'Sedan', 'Mercedes', 'C200', 2023, 'automatic', 'Sheikh Zayed', 4000.00, 'approved'),

(1, 'Economy Hyundai Elantra', 'Affordable and modern. Great for daily commuting inside Cairo.', 'Sedan', 'Hyundai', 'Elantra', 2022, 'automatic', 'Cairo', 700.00, 'approved'),

(1, 'Classic Jeep Wrangler', 'Ready for adventure? This Wrangler is perfect for off-roading and desert trips in Dahab.', 'SUV', 'Jeep', 'Wrangler', 2020, 'manual', 'Dahab', 1500.00, 'approved'),

(1, 'Powerful Ford Mustang', 'Feel the muscle. A powerful engine and iconic design for an unforgettable ride.', 'Sports', 'Ford', 'Mustang', 2021, 'automatic', 'New Cairo', 3000.00, 'approved'),

(1, 'Family Kia Sportage', 'Spacious SUV, perfect for family road trips. High safety rating and large trunk.', 'SUV', 'Kia', 'Sportage', 2023, 'automatic', 'Mansoura', 1200.00, 'approved'),

(1, 'Elegant Audi A4', 'German engineering at its best. Sophisticated design and powerful performance.', 'Sedan', 'Audi', 'A4', 2022, 'automatic', 'Cairo', 2200.00, 'approved'),

(1, 'Practical Nissan Sunny', 'Simple, practical, and gets the job done. The best budget option in Giza.', 'Sedan', 'Nissan', 'Sunny', 2021, 'manual', 'Giza', 500.00, 'approved');



INSERT INTO car_images (car_id, image_url, is_main) VALUES
(22, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000', 1), -- Tesla
(23, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000', 1), -- BMW
(24, 'https://images.unsplash.com/photo-1623860841270-2a628c6fc9cc?q=80&w=1000', 1), -- Toyota
(25, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000', 1), -- Mercedes
(26, 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=1000', 1), -- Hyundai
(27, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000', 1), -- Jeep
(28, 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=1000', 1), -- Ford
(29, 'https://images.unsplash.com/photo-1632243209675-01f11c752697?q=80&w=1000', 1), -- Kia
(30, 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000', 1), -- Audi
(31, 'https://images.unsplash.com/photo-1609520475181-039765b63428?q=80&w=1000', 1); -- Nissan
