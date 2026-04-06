<!-- user -->
name
email
password
role: user | admin


<!-- movies: -->
title
description
duration
genre
trailer
age rating


<!-- cinema hall -->
name
total_seats
layout {
    row[]
    seatsPerRow
    comforRows[]
}


<!-- screening -->
movie id
hall id
start time
end time
price


<!-- booking -->
user id
screening id
seats [{row, number, status: standard | comfort}]
amount
status: pending, confirmed, cancelled


<!-- tech -->
nestjs
mongodb
redis for cache/locking
bullmq for email, expiration jobs
docker+docker compose for deployment