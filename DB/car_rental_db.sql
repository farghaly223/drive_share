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

-- 2. إضافة 10 عربيات (برجاء التأكد أن الـ owner_id هو 1 أو حسب اللي طلع من الخطوة اللي فوق)
INSERT INTO Cars (owner_id, title, brand, model, year, transmission, location, rental_price, post_status) VALUES
(1, 'Luxury Tesla Experience', 'Tesla', 'Model 3', 2023, 'automatic', 'Cairo', 2500.00, 'approved'),
(1, 'Fast & Furious BMW', 'BMW', 'M4', 2022, 'automatic', 'Alexandria', 3500.00, 'approved'),
(1, 'Reliable Toyota Corolla', 'Toyota', 'Corolla', 2021, 'automatic', 'Giza', 800.00, 'approved'),
(1, 'Sporty Mercedes Benz', 'Mercedes', 'C200', 2023, 'automatic', 'Sheikh Zayed', 4000.00, 'approved'),
(1, 'Economy Hyundai Elantra', 'Hyundai', 'Elantra', 2022, 'automatic', 'Cairo', 700.00, 'approved'),
(1, 'Classic Jeep Wrangler', 'Jeep', 'Wrangler', 2020, 'manual', 'Dahab', 1500.00, 'approved'),
(1, 'Powerful Ford Mustang', 'Ford', 'Mustang', 2021, 'automatic', 'New Cairo', 3000.00, 'approved'),
(1, 'Family Kia Sportage', 'Kia', 'Sportage', 2023, 'automatic', 'Mansoura', 1200.00, 'approved'),
(1, 'Elegant Audi A4', 'Audi', 'A4', 2022, 'automatic', 'Cairo', 2200.00, 'approved'),
(1, 'Practical Nissan Sunny', 'Nissan', 'Sunny', 2021, 'manual', 'Giza', 500.00, 'approved');

-- 3. إضافة الصور (صورة لكل عربية)
INSERT INTO Car_Images (car_id, image_url, is_main) VALUES
(1, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=500', 1),
(2, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=500', 1),
(3, 'https://images.unsplash.com/photo-1623859627214-8938bc2100bc?q=80&w=500', 1),
(4, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=500', 1),
(5, 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?q=80&w=500', 1),
(6, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=500', 1),
(7, 'https://images.unsplash.com/photo-1584345604480-83475f916908?q=80&w=500', 1),
(8, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=500', 1),
(9, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=500', 1),
(10, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=500', 1);



