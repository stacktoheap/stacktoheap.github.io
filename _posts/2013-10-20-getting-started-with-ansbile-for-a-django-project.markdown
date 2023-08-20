---
layout: post
title: "Getting started with Ansbile for a Django project"
date: 2013-10-20 00:44
comments: true
categories: [ansible, iaas, python, django, chef]
excerpt: "This post walks through setting up a Django project with Ansible for provisioning and deployment."
---

On a Django project, I have been using Chef for configuration management. I am totally happy with Chef. It gets the job done. The community cookbooks are great.

But there's a new (relatively) kid in the block, by the name of Ansible, and I wanted to try it out for three main reasons:

1) It's way simpler than existing solutions like Chef and Puppet. From reading the docs, and seeing its yaml based playbooks, it does seem simple to write. My experience with it, enough to write this blog post, does show that it simple, flexible and well thought out.

2) It is written in Python and can be `pip` installed. That means no more dependency on Ruby when you are working on a Python project. Also, it provides some Python / Django stack specific modules like the `django_manage` and `supervisorctl` modules already.

3) It doesn't need any client software on the machines we intend to bootstrap. All that it would require is Python 2.4 or later ( not Python 3). It gets its job done through ssh. That is great news! Since many distributions have, and need, a relatively recent version of Python 2.X, this means that you don't need to install ANYTHING on the box being configured to use Ansible.

### Installing Ansible

I decided to install it through `pip` on Mac OS X. [Other installation methods](http://www.ansibleworks.com/docs/intro_installation.html) include using the package manager of your OS, or running from source.

{% highlight bash %}
pythonbrew venv create test-ansible
pythonbrew venv use test-ansbile
pip install ansible
pip freeze > requirements.txt
{% endhighlight %}

I use pythonbrew for managing my pythons and my virtualenvs, as mentioned in one of my previous blog posts - [Why use virtualenv when there is pythonbrew](/blog/2013/03/11/why-use-virtualenv-when-there-is-pythonbrew/)

### Vagrant

Of course, the next step is to get your Vagrant box up, and test your Ansible provisioning on it. The amazing authors of Vagrant have also provided a provisioner for Ansible, so using Ansible with Vagrant is simpler than it already is.

Do a `vagrant init` and configure it to provision with `ansible`. Your `Vagrantfile` may look something like below:

{% highlight ruby %}
Vagrant.configure("2") do |config|
  config.vm.box = "debian-7.1.0"

  config.vm.network :private_network, ip: "192.168.33.10"

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "site.yml"
    ansible.inventory_path = "hosts"
    ansible.verbose = "v"
  end
end
{% endhighlight %}

If you have done Chef/Puppet provisioning with Vagrant before, this should be familiar. All that the above does is to enable ansible provisioning and specifies the main playbook - `site.yml`. While Vagrant can automatically handle your inventory, I like to explicitly specify the hosts. For now, the `hosts` file would look like:

{% highlight ruby %}
[webservers]
192.168.33.10

[dbservers]
192.168.33.10
{% endhighlight %}

where `webserver` and `dbservers` are host groups.

### Directory Layout

I decided to follow the directory layout and structure as prescribed in the [Ansible best practises](http://www.ansibleworks.com/docs/playbooks_best_practices.html)

### Ansible Playbooks

I have setup a top level playbook `site.yml`, as mentioned in the VagrantFile, which just includes playbooks for different server roles. It looks something like:

{% highlight yaml %}
---
# file: site.yml
- include: webservers.yml
- include: dbservers.yml 
{% endhighlight %}

The `webservers.yml` and `dbservers.yml` look similar to what's described in the best practises link above.

### Common tasks

Common tasks like updating the apt cache, installing `build-essentials` and installing packages like git can be placed in the `common` role's tasks. The playbook for this would look something like:

{% highlight yaml %}
---
# file: roles/common/tasks/main.yml

- name: update apt cache
  apt: update_cache=yes cache_valid_time=3600
  tags: apt
  sudo: yes

- name: install build essentials
  apt: name=$item state=installed
  with_items:
    - autoconf
    - binutils-doc
    - bison
    - build-essential
    - flex
  sudo: yes

- name: install git
  apt: name=git state=latest
  sudo: yes
{% endhighlight %}

### Vagrant provision

We are now ready to provision:

{% highlight bash %}
$ vagrant provision   # vagrant up
{% endhighlight %}

Change ansbile verbosity by setting the `ansible.verbose` property appropriately in your VagrantFile.

That's all for this blog post. I will add more posts as I continue to configure the entire stack with Ansible. I am loving Ansible already. It takes the best of Puppet / Chef and comes with a very simplified way of doing configuration management. As I proceed, there will be some roadblocks, but I am looking forward to them as well.

I have setup a repo on Github - [django-ansible](https://github.com/manojlds/django-ansible).