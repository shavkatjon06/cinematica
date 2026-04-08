<!-- admin -->
name
email
password


<!-- movies: -->
title
description
duration
genre
trailer
age rating


<!-- cinema hall -->
name
raws {
    name
    type: 'standard' | 'comfort'
    seats
}


<!-- screening -->
movie id
hall id
start time
end time
price: {
    standard,
    comfort
}


<!-- booking -->
user id
screening id
seat
amount
status: pending, confirmed, cancelled


<!-- tech -->
nestjs
mongodb
redis for cache/locking
bullmq for email, expiration jobs
docker+docker compose for deployment