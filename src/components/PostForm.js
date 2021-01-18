import React, { useState } from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

const PostForm = () => {
  const [body, setBody] = useState("");
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: { body: body },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      let newData = [...data.getPosts];
      newData = [result.data.createPost, ...newData];
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          ...data,
          getPosts: {
            newData,
          },
        },
      });
      setBody("");
    },
  });
  const onSubmit = (e) => {
    e.preventDefault();
    createPost();
  };
  return (
    <>
      <Form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
        <h2>Create a Post:</h2>
        <Form.Field>
          <Grid>
            <Grid.Row>
              <Grid.Column width={14}>
                <Form.Input
                  placeholder="Hello World!"
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  error={error ? true : false}
                />
              </Grid.Column>
              <Grid.Column width={1}>
                <Button type="submit" color="teal" floated="left">
                  Post
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
