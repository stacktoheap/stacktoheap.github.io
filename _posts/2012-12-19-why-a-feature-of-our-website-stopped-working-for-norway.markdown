---
layout: post
title: "Why a feature of our website stopped working for Norway"
date: 2012-12-19 00:07
comments: true
categories: [cold fusion, service, json, serialization]
excerpt: "We recently discovered that a feature on our site stopped working for users in Norway. Here's what happened and how we fixed it."
---

Our client's website makes a call to an external service ( internal legacy service, actually ) to get JSON response needed for a feature that is part of a specific page of the website. The feature is based on the country from which the user is accessing the page and displays different information for different countries.

This feature has been in production for a few days now, and all has been good. But we found that, for Norway users, the feature was not being displayed. That happens when there was some problem with accessing or processing the data from the service.

At a cursory glance, the JSON response from the service seemed fine. The data pertinent to the feature were all coming in. The application should be working as expected, like it does for other countries.

Then we noticed that the country part of the JSON data was coming back as "false". The data that ought to return the country code - like "GB", "US", etc. - was returning false.

Some weird bug in the external service it seemed apparent, but it dawned on us what that bug might really be - the country code for Norway is "NO" [and it was being serialized as boolean false in the Cold Fusion web service!](http://www.codersrevolution.com/index.cfm/2008/9/10/ColdFusion-JSON-and-Booleans)

Fun little bug there. We do have consumer driven contracts tests against the service, and functional tests, but am not sure how issues like this could have been caught? Yes, the service should have been more thoroughly tested, but what could we, as consumers, have done better? Just smile a bit and file a bug, for now.`