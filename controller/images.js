const imageHandler = (req, res, stub, metadata, db) => {
  const { id, input } = req.body;
  console.log(input, id);

  //   a403429f2ddf4b49b307e318f00e528b

  stub.PostModelOutputs(
    {
      model_id: "a403429f2ddf4b49b307e318f00e528b",
      inputs: [{ data: { image: { url: input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
        return;
      }

      console.log("Predicted concepts, with confidence values:");
      for (const c of response.outputs[0].data.concepts) {
        console.log(c.name + ": " + c.value);
      }
      db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => {
          res.json({ entries: entries[0].entries, response });
        })
        .catch((err) => res.status(400).json("unable to get times"));
    }
  );

  //
};

module.exports = {
  imageHandler,
};
