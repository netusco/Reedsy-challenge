# Reedsy Challenge

Coding Challenge for [reedsy.com](reedsy.com)
Following the specifications gathered in docs/challenge.md


## Requirements

- node >=6.x
- npm >=4.x

Used [Ujjawal's BoilerPlate](https://github.com/11ujjawal/mean)

## Installation

clone the repository and then run `npm install`

## Usage

`npm start` to run the app
`npm test` to run the tests

## Notes

I've choosen this boilerplate because it was simple, lean, it is a MEAN stack and it had babel to transpile ES6 code.
It's the first time I use gulp, I'm more experienced in Grunt and Webpack, so I've appreciated the chance to learn a bit how it works.
I've used [socket.io](https://socket.io/) to communicate the state of the conversions and update it on the front as it's a robust solution that allows
to spread the signal to any connected client.
I've used [agenda](https://www.npmjs.com/package/agenda) as a queue system. I didn't spend a lot of time searching the best dependency
and I found that this one was having the priority, schedule and other tools I needed. I could had used the same records it has in the db
but I prefered to create a separated collection called conversions as it allows a better scalability and separation of tasks.
I didn't create any service (to handle the api requests from Angular) neither directives as I didn't see the point for this little 
challenge. I believe scalability is something to keep in mind as we code, to not create knots that are hard to refactor later, but at the
same time scalability comes from 'scala' in catalan is 'escala' which means ladder and it represents a way that grows higher, but step by step.

I've set the concurrency of the queue system to 3 which means that it only processes 3 jobs asynchronously. I did this in order to visually
be able to see better the priority choices.
I've noticed, thought, that sometimes it doesn't follow the right order on processing but I think it's due to the variability of the speed 
in the api calls and the fact that I've separated the conversions and the job. So if we click several times fast enough, we might end 
with a different order of jobs than conversions. Ex. conversion num 3 might have the job number 4 and so be processed after conversion num 4.
It didn't find it a big deal to spend more time solving this issue, it can be solved by applying some consistency between the two collections
or just simply disabling the button until the saved signal of the two collections is received.

UPDATE: for the bonus proposed I've created one directive to create the flash message that hides on certain timeout.
