FROM node
ARG GIT_REPO_URL	
ENV LAST_UPDATED 20160605T165400	
LABEL description="webaverse-app"
	
# Copy source code
RUN git clone --recurse-submodules $GIT_REPO_URL 
	

# Change working directory
WORKDIR /app
	

# Install dependencies
RUN apt update -y
RUN npm install forever -g
RUN npm install
RUN npm list
	

# Expose API port to the outside
EXPOSE 3000
EXPOSE 3001
	

	# Launch application
CMD forever -a -l /host/forever.log -o stdout.log -e stderr.log index.js
