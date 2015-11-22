---
layout: post
title: "Sharing docker images without a registry"
date: 2015-11-22 23:30
comments: true
categories: [docker, registry]
---

One of the well-known ways of sharing docker images is via a registry - be it the hosted ones like [DockerHub](https://hub.docker.com/) or [Quay.io](https://quay.io/), or private registries setup within your organization.

Also, once a workstation has a set of images, pulling in new versions or similar images becomes a breeze.

### Why no registry?

Recently, when we were switching to a docker based workflow, we found that pulling in the base set of images from our internal registry on AWS + S3 was taking a lot of time. Not to mention that it was also eating up our bandwidth. In order to make it easy and fast for new developers to get started with our project, we wanted to setup a local "store" of images that we can pull our images from. This store will also help us share new images much faster as well.

Instead of setting up a local registry in our office LAN, we decided to keep things simple and setup a simple workstation to pull in images as files. The `docker save` and `docker load` commands helped us beautifully here. We also piped from/to these command directly to/from the workstation, and avoided local files altogether.

### docker save and docker load

First, some basics about `docker save` and `docker load`:

`docker save` allows use to save a image to a tar archive. It streams to STDOUT by default, or to a file specified by the `-o, --output` flag.

`docker load` sits in the other end, and takes in input from a file, specified by the `-i, --input` flag or STDIN.

### Sync to/from external host via ssh

Once we had the workstation in our LAN (let's say its IP is 192.168.0.42), syncing an image to it is as simple as:

```bash
docker save internal-registry/image:1.0.0 | bzip2 | \
 pv | ssh 192.168.0.42 "cat > ~/docker_images/image-1.0.0"
```
(this push can be done from a one workstation where the image was built, or pulled in from a registry)

We used bzip2 to compress the data, and the amazing pv tool to visualize the transfer.

Pulling in an image is not much different:

```bash
ssh 192.168.0.42 "cat ~/docker_images/image:1.0.0" | pv | \
 bunzip2 | docker load
```

This simple setup makes pulling in images much faster, and also saves bandwidth. Hope this is useful in your work environment too.
