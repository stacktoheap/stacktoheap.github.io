---
layout: post
title: "Things that trip newbies in Powershell - Pipeline Output"
date: 2013-06-15 00:37
comments: true
categories: [powershell, gotchas, piepline, newbie]
excerpt: "Some common things that trip new Powershell users when working with pipeline output"
---

After the previous posts that pointed out the [gotchas with powershell](/blog/2013/02/18/things-that-trip-newbies-in-powershell-encodings/), now is the time to look at a more confusing aspect of Powershell. One that almost every newbie encounters, and gets immensely frustrated trying to figure out what's happening.

I will be talking about pipeline output and return values from functions in this post.

Let's start with an example that illustrates the confusing aspect:

{% highlight powershell %}
function CheckParameterIsOne($paramter) {
    echo "Checking parameter is one"
    return $parameter -eq 1
}

if(CheckParameterIsOne(2)){
    echo "Parameter was one"
} else {
    echo "Parameter was not one"
}
{% endhighlight %}

Pardon the contrived example, but this is something that I come across a lot. A function that checks for a condition, or returns some value, and also "echoing" what it is doing.

It would be normal to expect the above to print `Paremeter was not one`. But the thing is, the function will always be true and you will always get `Parameter was one` printed, irrespective of the parameter. What's more, the line `Checking parameter is one` is NEVER printed. What's happening?

Functions in Powershell return values to the pipeline. And the values returned are not only through `return`, but any uncaptured object is returned to the pipeline. 

That is, the following two are equivalent:

{% highlight powershell %}
function CheckParameterIsOneWithReturn($paramter) {
    echo "Checking parameter is one"
    return $parameter -eq 1
}

function CheckParameterIsOneWithoutReturn($paramter) {
    echo "Checking parameter is one"
    $parameter -eq 1
}
{% endhighlight %}

Also, since `echo`, the alias for `Write-Output` ( another gotcha - it is not an alias for `Write-Host`) send the object to the pipeline, the `echo "Checking parameter was one"` is also passed to the pipeline along with the boolean from the condition.

Since the function ALWAYS returns two objects to the pipeline - effectively something like - `@("Checking parameter was one", "$true")` - the function's output is always a truthy value.

Moreover, the returned object are "captured" by the `if` condition, and that is the reason why you never the "Checking parameter is one" output.

Fix the function by converting it to just:

{% highlight powershell %}
function CheckParameterIsOneWithReturn($paramter) {
    return $parameter -eq 1
}
{% endhighlight %}

This will return a `$true` or `$false` and will behave as expected.








