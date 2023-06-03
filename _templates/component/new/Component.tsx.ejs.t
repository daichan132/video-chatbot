---
to: <%= path %>/<%= name%>.tsx
---
import { type FC } from 'react';
<% if (have_props) { -%>

export type <%= name%>Props = {};
<% } -%>

export const <%= name%>: <%- type_annotate %> = <%= props %> => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};
