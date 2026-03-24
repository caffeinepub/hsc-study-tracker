import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userData = Map.empty<Principal, Text>();

  public shared ({ caller }) func save(backendState : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their data.");
    };
    userData.add(caller, backendState);
  };

  public query ({ caller }) func load() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can load their data.");
    };
    userData.get(caller);
  };
};
