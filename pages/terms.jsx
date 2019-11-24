import React from 'react';
import Router from 'next/router';
import { stringify } from '../helpers/url';
import Page from '../components/Page';
import TermsContents from '../components/Terms';
import uris from '../uris';
import { Context } from '../helpers/context';

const Terms = (props) => {
  const context = useContext(Context);
  return (
    <div>
      <Page
        lead="Terms of Service"
        onClose={() => {
          Router.push(uris.pages.root);
        }}
      >
        <TermsContents i18n={context.i18n} />
      </Page>
    </div>
  );
};

export default Terms;
