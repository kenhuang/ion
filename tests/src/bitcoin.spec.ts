// MUST set these environment variables before `blockchainService` and `server` are imported.
process.env.SIDETREE_TEST_MODE = 'true';
process.env.SIDETREE_BITCOIN_CONFIG_FILE_PATH = '../tests/json/bitcoin-config-test.json';

import * as supertest from 'supertest';
import ErrorCode from 'sidetree-kenhuang/lib/common/SharedErrorCode';
import RequestError from 'sidetree-kenhuang/lib/bitcoin/RequestError';
import { blockchainService, server } from '../../src/bitcoin';
import { ResponseStatus } from 'sidetree-kenhuang/lib/common/Response';

describe('Bitcoin service', async () => {
  it('should return 400 with error code when transaction fecth throws invalid hash error.', async () => {
    const fakeGetTransactionsMethod = async () => { throw new RequestError(ResponseStatus.BadRequest, ErrorCode.InvalidTransactionNumberOrTimeHash); };
    spyOn(blockchainService, 'transactions').and.callFake(fakeGetTransactionsMethod);

    const response = await supertest(server).get('/transactions?since=6212927891701761&transaction-time-hash=dummyHash');

    expect(response.status).toEqual(400);

    const actualResponseBody = JSON.parse(response.body.toString());
    expect(actualResponseBody).toBeDefined();
    expect(actualResponseBody.code).toEqual(ErrorCode.InvalidTransactionNumberOrTimeHash);
  });
});
