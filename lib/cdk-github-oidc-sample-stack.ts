import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GitHubActionsOidc } from './constructs/github-actions-oidc';

export class CdkGithubOidcSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new GitHubActionsOidc(this, 'GitHubActionsOidc', {
      gitHubOwner: 'tomoki10',
      gitHubRepo: 'cdk-github-oidc-sample',
    });
  }
}
