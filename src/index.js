import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import gql from 'graphql-tag';


const networkInterface = createNetworkInterface({
 uri: 'http://localhost:3000/graphql',
 cachePolicy: { query: true, data: false }
});

const wsClient = new SubscriptionClient( 'ws://localhost:5000', {
    reconnect: true,
    connectionCallback:(err,data)=>{
        if(!err)
      {
            console.log('connection established successfully')
        }
        console.log(err);
    }
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
);
const apolloClient = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
});
apolloClient.networkInterface.use([{
   applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    req.options.headers.Authorization ='Bearer eyJ0eXAiOiJKV1QiLCJTQMGdkRml3VSIsImtpZCI6ImpTcEJjejBIdW01dVlGYnV2T2pQMGdkRml3VSJ9.eyJpc3MiOiJodHRwczovL2RldmF1dGgucDEwLmlvL2F1dGgiLCJhdWQiOiJodHRwczovL2RldmF1dGgucDEwLmlvL2F1dGgvcmVzb3VyY2VzIiwiZXhwIjoxNTI3MDczMzk2LCJuYmYiOjE1MjY5ODY5OTYsImNsaWVudF9pZCI6Imd0ditxMDRsdS9sNVpmS3kwdldGSmpEcjlHN0dzRGFXUGlWaXdwSjBZSnM9Iiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsIm9mZmxpbmVfYWNjZXNzIiwiZW1haWwiLCJub3RpZmljYXRpb24iLCJiYWFzIl0sInN1YiI6InNrc2hpcnNhZ2FyQHBhcmFneXRlLmNvbSIsImF1dGhfdGltZSI6MTUyNjk4Njk5NSwiaWRwIjoicDEwT0F1dGgiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.D5N758XxaeGhYRWxP2549oRJbDXXi1p8t9JZ4DmQKgPTYoc75XlYOUQXCnpDSM4FjBcxQMXG34oh-gAztgV0wExT7-Z7PxA1T0ZhLY9u_LMR36z9-5FdrUv_j2eHlb72p7PyUyvETtTAq6VhbNIlVShTMwmaB6M0wbtU5VyDaVUlkGX2z6gP115fSXhFibMKe0Gvu4AsICSp8LQaJ0yO6Unyy4UXkP-EhIAK-E9-MlsNaOttQelVFFIyAXeO66TNImb-BPEpRFV5G4nTzMsTF5wXIyHSqaxq1-QylqVo3srQ2K04_CqliLQQGiYkp70HyIqGXrBeQgjK4aRLp94WIQ';
    next();
   }
}])



var query=`subscription{
  User(input:{create:true,remove:true,update:true}){
  user{id,email}
  }
}
`;
var variables={};

var sub = apolloClient.subscribe({
  query:gql(query),
  variables: variables
});

sub.subscriberFunction({
      next(result) {
        console.log('result',result);
      },
      error(err) { console.error('Error while subscription', err); }
});


function upsertModelItem(query){
    let queryDoc = gql(query);
    return apolloClient.mutate({
        "mutation" : queryDoc,
        "variables" : {
            "Inputs" : {
                "where" :{}
            }
        }
    })
}

window.upsertModelItem = upsertModelItem;