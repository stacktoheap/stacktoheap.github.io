
---
layout: post
title: "Thoughts on FastHTML"
excerpt: "Why I Moved from FastHTML to Svelte for Building a Complex Chat Application"
reading_time: "4 mins"
date: 2024-09-06 12:45
comments: true
categories: [ml, frontend]
tags: [ml, fasthtml, svelte, htmx]
image: "fasthtml.jpg"
---


I've been working on building a chat application that required complex visualizations and interactions. Initially, I decided to try out FastHTML for this project.

FastHTML, combined with htmx, seemed like a promising stack, especially with its modern approach to handling dynamic web content. However, after spending considerable time with it, I found myself at a crossroads.

## The Struggles with FastHTML

FastHTML is great for certain types of projects, but as I started building my chat application, I started hitting roadblocks.

The complexity of the visualizations and interactions I wanted to implement wasn't meshing well with FastHTML’s current capabilities. I wanted to provide clean flow visualizations that are possible with ReactFlow/SvelteFlow, but are very diffcult to integrate and work with in FastHTML. 

Htmx is also a neat tool that has its use, but  learning it took sometime as well and doing things like out of band swaps and other things was getting tiring.

FastHTML, when I was trying it out, also had a lot of bugs. Websocket examples were broken when I was starting and had to dig a lot into the code to undeerstand what was happening. Bugs are expected in a new product, but it was just preventing me from being immediately productive for a short project.

I would definitely use FastHTML for simpler applications (landing pages, CRUD) with less user interactions and when not having to rely on complex libraries that exist in the React and related ecosystems.

## The Downside of Writing Views in Python

Another factor that contributed to my decision was the way views are written in FastHTML—using Python. Initially, I found this approach intriguing; it’s not every day you get to write your front-end code in Python without any Javascript or Typescript. But as the project grew, it became tedious. The novelty wore off, and I realized that separating concerns with a JavaScript-based front-end made more sense for the complexity I was dealing with.

## Transitioning to Svelte

After wrestling with FastHTML for a while, I decided it was time to pivot. Svelte had been on my radar for quite some time, and the features provided by SvelteFlow (a framework visualizing flows with drag and drop nodes) were exactly what I needed for my project.

Transitioning to Svelte (Svelte + SvelteKit + Skeleton to be precise) was surprisingly smooth, despite not having worked with it before. My prior experience with React and Vue certainly helped, but Svelte's simplicity and intuitive API made the learning curve almost non-existent.

## Conclusion
In the end, while FastHTML and htmx are powerful tools for certain projects, they weren’t the right fit for my chat application. Svelte, with its ease of use and the added capabilities of SvelteFlow, provided a much smoother development experience. 

The frontend ecosystem of today does get some deserved criticisms, but they do make building frontend systems joyous at times, especially with the likes of Svelte.