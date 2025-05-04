import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Effect, FederatedPrincipal, OpenIdConnectProvider, Policy, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';

const CDK_QUALIFIER = 'hnb659fds';

interface GitHubActionsOidcProps extends cdk.StackProps {
  gitHubOwner: string;
  gitHubRepo: string;
}

export class GitHubActionsOidc extends Construct {
  constructor(scope: Construct, id: string, props: GitHubActionsOidcProps) {
    super(scope, id);

    // MEMO: 1アカウント1つのみ作成可能
    new OpenIdConnectProvider(this, 'OpenIdConnectProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    const gitHubOwner = props.gitHubOwner;
    const gitHubRepo = props.gitHubRepo;
    const awsAccountId = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    const gitHubActionsOidcRole = new Role(this, 'GitHubActionsOidcRole', {
        assumedBy: new FederatedPrincipal(
          `arn:aws:iam::${awsAccountId}:oidc-provider/token.actions.githubusercontent.com`,
          {
            StringEquals: {
              'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            },
            StringLike: {
              // 特定のGitHub Org/Repoからの操作をすべて許可
              'token.actions.githubusercontent.com:sub': `repo:${gitHubOwner}/${gitHubRepo}:*`,
            },
          },
          'sts:AssumeRoleWithWebIdentity',
        ),
      },
    );
    new cdk.CfnOutput(this, 'GitHubActionsOidcRoleArnOutput', {
      value: gitHubActionsOidcRole.roleArn,
    });

    /**
     * CDKを実行するGitHub Actions上で必要な権限を付与
     */
    const cdkDeployPolicy = new Policy(this, 'CdkDeployPolicy', {
      policyName: 'CdkDeployPolicy',
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:getBucketLocation', 's3:List*'],
          resources: ['arn:aws:s3:::*'],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'cloudformation:CreateStack',
            'cloudformation:CreateChangeSet',
            'cloudformation:DeleteChangeSet',
            'cloudformation:DescribeChangeSet',
            'cloudformation:DescribeStacks',
            'cloudformation:DescribeStackEvents',
            'cloudformation:ExecuteChangeSet',
            'cloudformation:GetTemplate',
          ],
          resources: ['*'],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
          resources: [`arn:aws:s3:::cdk-${CDK_QUALIFIER}-assets-${awsAccountId}-${region}/*`],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['ssm:GetParameter'],
          resources: [
            `arn:aws:ssm:${region}:${awsAccountId}:parameter/cdk-bootstrap/${CDK_QUALIFIER}/version`,
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['iam:PassRole'],
          resources: [
            `arn:aws:iam::${awsAccountId}:role/cdk-${CDK_QUALIFIER}-cfn-exec-role-${awsAccountId}-${region}`,
          ],
        }),
      ],
    });
    gitHubActionsOidcRole.attachInlinePolicy(cdkDeployPolicy);
  }
}