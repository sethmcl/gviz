gviz
====

To use:

1. Run "npm install" from root to install dependencies
2. Add a symbolic link to the bin/gviz script to your path.
  a. For example, if ~/bin is in your path, you could do this:
      cd ~/bin
      ln -s PATH_TO_GVIZ_ROOT/bin/gviz gviz
3. From any git repo, you can now simply run the "gviz" command
4. This will start the server. The console will list the port the server is running on.
   You can specify the port to use by passing it as the second argument, e.g.,: "gviz 2020"
   If you don't specify a port, a random one will be chosen (between 1000-2000).
5. Navigate to hostname:port/log - you should see a JSON object containing the log for your repo.
