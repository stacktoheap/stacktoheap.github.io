---
layout: post
title: "Things you may not know about git - autocorrect your commands"
date: 2015-11-01 02:30
comments: true
categories: [ansible, iaas, python, django, chef]
excerpt: "Did you know git has a built-in autocorrect feature to fix common typos in git commands?"
---

Did you ever fat finger a git command? Did git actually ask you if you meant the command which you intended to type anyway? Were you mildly irritated that git didn't go ahead and executed the command it deduced? Something like the interaction below:

{% highlight bash %}
$ git psuh
git: 'psuh' is not a git command. See 'git --help'.

Did you mean this?
  push
{% endhighlight %}

Well, you can turn your irritation into admiration for git. git has a autocorrect feature that you can enable if needed.

The feature can be enabled by setting the `help.autocorrect` config appropriately. Here's what the man pages have to say about the setting:

{% blockquote %}
Automatically correct and execute mistyped commands after waiting for the given number of deciseconds (0.1 sec). If more than one command can be deduced from the entered text, nothing will be executed. If the value of this option is negative, the corrected command will be executed immediately. If the value is 0 - the command will be just shown but not executed. This is the default.
{% endblockquote %}

By default, the `help.autocorrect` value is 0, which means that you get the `Did you mean this?` question, but no correction happens. Setting it to a positive value will make git correct to deduced command after that much time (in deciseconds - so setting a value of 10 will make git autocorrect in a second.) Setting a negative value will make git autocorrect immediately, and this is probably something you don't want.

So go ahead and set `help.autocorrect` to a sane value, and stop worrying about your typos:

{% highlight bash %}
git config --global help.autocorrect 10
{% endhighlight %}

Now, you interaction with git can be irritation-free:

{% highlight bash %}
$ git psuh
WARNING: You called a Git command named 'psuh', which does not exist.
Continuing under the assumption that you meant 'push'
in 1.0 seconds automatically...
{% endhighlight %}

Related: While the above is only for git, you might want to look at [thefuck](https://github.com/nvbn/thefuck) if you want similar autocorrect for any command you type. The appropriately named utility goes beyond just correcting typos, however. It can also do suggested commands (like `git push` when no upstream is set.)
