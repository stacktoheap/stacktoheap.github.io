---
layout: post
title: "Things that trip newbies in Powershell"
date: 2012-12-16 22:44
comments: true
categories: [powershell]
excerpt: "Some common things that trip up new Powershell users."
---

Powershell is amazing. It really lives upto its name. But many a times, I have found new comers tripping on a few Powershell oddities. Here I higlight my favorite three.

First and foremost, something that confuses most anyone who starts using Powershell is what version of Powershell that they are using. Micorosft, in its usual ways, install Powershell, upto the latest 3.0 version, at the `C:\Windows\System32\WindowsPowerShell\v1.0` ( you can get it by doing `$pshome` from a Powershell console.) Notice the `v1.0` at the end. Seeing that, it obviously raises confusion as most resource on Powershell is for v2.0 ( at the time of this writing, eventhough v3.0 is out.) ad people want to be on v2.0 and not v1.0. The easiest way to identify the Powershell version is to just run `get-host` in Powershell. Or to be more specific `(get-host).Version`.

Another thing that causes even more confusion is the way to pass arguments to functions.

Say there is a function as defined below:

{% highlight powershell %}
function Name($firstName, $lastName){
    write-host "First name: $firstName"
    write-host "Last name: $lastName"
}
{% endhighlight %}

If we call the function `Name John, Smith`, the expected output would be something like:

{% highlight powershell %}
First name: John
Last name: Smith
{% endhighlight %}

But what would be seen is:

{% highlight powershell %}
First name: John Smith
Last name:
{% endhighlight %}

I have seen many do this mistake. Arguments in Powershell, to Powershell functions are separated by space. When you comma delimit them, you are actually passing an array of those values. In this case, the array with two values `("John", "Smith"), was given to the parameter `$firstName` and hence the output you see.

I mention Powershell functions above because method calls on .NET objects still use comma to delimit arguments:

{% highlight powershell %}
[string]::format("{0},{1}", "comma", "delimited")
{% endhighlight %}

Lastly, I see newcomers get trumped by `Select-Object`. As known, Select-Object selects particular properties from objects and sends them to the pipeline.

For example, 

{% highlight powershell %}
$names = get-childitem . | select-object Name
{% endhighlight %}

would put the names of directories and files in the current directory in `$names`

It is logical to thing that `$names` is a collection of strings. But it is not! It is a collection of objects with a single property (in this case) `Name`. To access the actual name, you do `$names[0].Name`.

If you wanted only the collection of string in the first place, you use the `-ExpandProperty` parameter (`-expand` in short) of `Select-Object`:

{% highlight powershell %}
$names = get-childitem . | select-object -expand Name
{% endhighlight %}

Now, `$names` is just a collection of vanilla strings.

