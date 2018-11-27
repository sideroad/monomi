FROM node:10-alpine
WORKDIR /root/
COPY src /root/src
COPY static /root/static
COPY i18n /root/i18n
COPY *.json /root/

ENV GLOBAL_HOST monomi.now.sh
ENV GLOBAL_PORT 443
ENV NODE_ENV production
ENV NODE_PATH ./src
ENV KOIKI_MONOMI_GOOGLE_API_KEY AIzaSyD-cN8kJmyaYkxOfYfda-MC4Llb62LpMOE
ENV KOIKI_MONOMI_MAPBOX_TOKEN pk.eyJ1Ijoic2lkZXJvYWQiLCJhIjoiY2pvenRqNGl5Mm90cDNxbzluY2czcjJnaiJ9.Oyh_K8Qy3j5Kukw_sFYHnA
ENV NPM_CONFIG_PRODUCTION false
RUN npm i --unsafe-perm --production
RUN printenv
EXPOSE 3000
CMD ["npm", "start"]
