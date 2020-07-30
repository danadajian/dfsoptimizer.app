import {Lambda, S3} from "../aws";
import {isDevelopment} from "../constants";

const mockFanduelData = require('../fixtures/fanduelDataResponse.json');
const mockProjectionsData = require('../fixtures/nflProjectionsResponse.json');
const mockRollingAveragesData = require('../fixtures/rollingAveragesResponse.json');
const mockOpponentRanksData = require('../fixtures/opponentRanksResponse.json');
const mockInjuriesData = require('../fixtures/nflInjuriesResponse.json');
const mockOptimalLineupResponse = require('../fixtures/optimalLineupResponse.json');

export const retrieveObjectFromS3 = async (fileName: string): Promise<any> => {
    const params = {
        Bucket: 'dfs-pipeline',
        Key: fileName
    };
    if (isDevelopment()) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(250);
        return [
            {
                id: 0,
                sport: 'mlb',
                time: '6:30 PM EST'
            },
            {
                id: 1,
                sport: 'nfl',
                time: '8:30 PM EST'
            }
        ]
    } else {
        const data: any = await S3.getObject(params).promise();
        return JSON.parse(data.Body.toString());
    }
};

export const invokeLambdaFunction = async (functionName: any, payload = {}) => {
    const params = {
        FunctionName: functionName,
        Payload: JSON.stringify(payload)
    };
    if (isDevelopment()) {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(250);
        return mockResponseMap[functionName]
    } else {
        const response: any = await Lambda.invoke(params).promise();
        return JSON.parse(response.Payload.toString());
    }
};

const mockResponseMap: any = {
    'dfs-optimizer-stack-GetFanduelDataFunction-77GMJJP3YXN8': mockFanduelData,
    'dfs-optimizer-stack-GetProjectionsDataFunction-QKLNCL4DUKM2': mockProjectionsData,
    'dfs-optimizer-stack-GetOpponentRanksDataFunction-9KIEIP392WEF': mockOpponentRanksData,
    'dfs-optimizer-stack-GetInjuryDataFunction-NBYNB8ZSZBW6': mockInjuriesData,
    'dfs-optimizer-stack-GetOptimalLineupFunction-12U6F4GY6ANQ2': mockOptimalLineupResponse,
    'fantasy-analytics-stack-GetRollingFantasyPointAver-1G09RZFW4ADLR': mockRollingAveragesData
};